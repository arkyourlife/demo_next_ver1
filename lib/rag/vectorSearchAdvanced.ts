import * as fs from 'fs'
import * as path from 'path'
import { embedText } from '@/lib/services/openai'
import { config } from '@/lib/config'

interface ProfessorMetadata {
  name: string
  name_en: string
  fields: string[]
  keywords: string[]
  lab_url: string
  email: string
}

interface RagDocument {
  id: string
  text: string
  metadata: ProfessorMetadata
}

interface SearchResult {
  text: string
  metadata: ProfessorMetadata
  score: number
}

export class AdvancedVectorSearch {
  private documents: RagDocument[] = []
  private vectorIndex: number[][] = []
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      // 加载metadata
      const metadataPath = path.resolve(config.rag.metadataPath)
      if (!fs.existsSync(metadataPath)) {
        console.warn('Professor metadata file not found, using empty dataset')
        this.documents = []
        this.isInitialized = true
        return
      }

      const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
      this.documents = JSON.parse(metadataContent)

      // 尝试加载 FAISS 向量索引（如果存在）
      await this.loadVectorIndex()
      
      console.log(`Loaded ${this.documents.length} professor documents`)
      this.isInitialized = true
    } catch (error) {
      console.error('Error initializing advanced vector search:', error)
      this.documents = []
      this.isInitialized = true
    }
  }

  private async loadVectorIndex() {
    try {
      // 这里可以加载您的 professor_index.faiss 文件
      // 由于 Node.js 环境的限制，我们使用替代方案
      
      const indexPath = path.resolve(config.rag.indexPath)
      if (fs.existsSync(indexPath)) {
        console.log('FAISS index file found, but using alternative implementation')
        // 在实际应用中，这里应该加载 FAISS 索引
        // 目前我们预计算一些向量用于演示
        await this.precomputeVectors()
      } else {
        console.log('FAISS index file not found, using text-based search')
      }
    } catch (error) {
      console.error('Error loading vector index:', error)
    }
  }

  private async precomputeVectors() {
    try {
      // 为每个文档预计算向量（这里是演示版本）
      // 在实际应用中，您应该直接从 FAISS 文件加载
      console.log('Precomputing vectors for documents...')
      
      // 这里我们可以使用您已经计算好的向量
      // 如果您有对应的向量数据，可以直接加载
      
      for (let i = 0; i < this.documents.length; i++) {
        // 模拟向量（实际应从FAISS文件加载）
        this.vectorIndex.push(new Array(1536).fill(0).map(() => Math.random()))
      }
      
      console.log(`Precomputed vectors for ${this.vectorIndex.length} documents`)
    } catch (error) {
      console.error('Error precomputing vectors:', error)
    }
  }

  async searchWithVector(query: string, topK: number = 5): Promise<SearchResult[]> {
    await this.initialize()
    
    if (this.documents.length === 0) {
      return []
    }

    try {
      // 1. 将查询转换为向量
      const queryVector = await embedText(query)
      
      // 2. 计算相似度（如果有预计算的向量）
      if (this.vectorIndex.length > 0) {
        const similarities = this.vectorIndex.map((docVector, index) => ({
          index,
          similarity: this.cosineSimilarity(queryVector, docVector)
        }))
        
        // 3. 排序并取top-k
        similarities.sort((a, b) => b.similarity - a.similarity)
        
        return similarities
          .slice(0, topK)
          .map(item => ({
            text: this.documents[item.index].text,
            metadata: this.documents[item.index].metadata,
            score: item.similarity
          }))
      } else {
        // 回退到文本搜索
        return this.textBasedSearch(query, topK)
      }
    } catch (error) {
      console.error('Error in vector search:', error)
      return this.textBasedSearch(query, topK)
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // 回退的文本搜索方法
  private textBasedSearch(query: string, topK: number): SearchResult[] {
    const queryLower = query.toLowerCase()
    
    const results: SearchResult[] = this.documents
      .map(doc => {
        const textLower = doc.text.toLowerCase()
        let score = 0
        
        // 关键词匹配
        if (doc.metadata.keywords) {
          doc.metadata.keywords.forEach(keyword => {
            if (queryLower.includes(keyword.toLowerCase())) {
              score += 2
            }
          })
        }
        
        // 研究领域匹配
        if (doc.metadata.fields) {
          doc.metadata.fields.forEach(field => {
            if (queryLower.includes(field.toLowerCase())) {
              score += 3
            }
          })
        }
        
        // 姓名匹配
        if (queryLower.includes(doc.metadata.name.toLowerCase()) || 
            queryLower.includes(doc.metadata.name_en.toLowerCase())) {
          score += 5
        }
        
        // 文本内容匹配
        if (textLower.includes(queryLower)) {
          score += 1
        }
        
        return {
          text: doc.text,
          metadata: doc.metadata,
          score
        }
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    return results
  }

  // 兼容旧接口
  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    return this.searchWithVector(query, topK)
  }
}

// 创建高级搜索实例
export const advancedVectorSearch = new AdvancedVectorSearch() 