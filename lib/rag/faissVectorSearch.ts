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

interface VectorData {
  vectors: number[][]
  metadata: RagDocument[] | ProfessorMetadata[]
  index_info: {
    total_vectors: number
    vector_dimension: number
    index_type: string
  }
}

interface SearchResult {
  text: string
  metadata: ProfessorMetadata
  score: number
}

// 类型保护函数
function isRagDocument(item: any): item is RagDocument {
  return item && typeof item.id === 'string' && typeof item.text === 'string' && item.metadata
}

function isProfessorMetadata(item: any): item is ProfessorMetadata {
  return item && typeof item.name === 'string' && Array.isArray(item.fields)
}

export class FaissVectorSearch {
  private vectorData: VectorData | null = null
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      // 优先尝试加载RAG文档数据
      const ragDocsPath = path.resolve('./data/rag_documents.json')
      
      if (fs.existsSync(ragDocsPath)) {
        console.log('🔍 加载RAG文档数据...')
        const content = fs.readFileSync(ragDocsPath, 'utf-8')
        const ragDocs = JSON.parse(content)
        
        this.vectorData = {
          vectors: [],
          metadata: ragDocs,
          index_info: {
            total_vectors: ragDocs.length,
            vector_dimension: 0,
            index_type: 'text-only'
          }
        }
        console.log(`✅ 成功加载 ${ragDocs.length} 个RAG文档`)
      } else {
        // 回退到向量数据
        const vectorDataPath = path.resolve('./data/vectors_with_metadata.json')
        
        if (fs.existsSync(vectorDataPath)) {
          console.log('🔍 加载FAISS向量数据...')
          const content = fs.readFileSync(vectorDataPath, 'utf-8')
          this.vectorData = JSON.parse(content)
          console.log(`✅ 成功加载 ${this.vectorData?.index_info.total_vectors} 个向量`)
        } else {
          // 最后回退到仅元数据模式
          console.log('⚠️  未找到数据文件，使用元数据模式')
          
          const metadataPath = path.resolve(config.rag.metadataPath)
          if (fs.existsSync(metadataPath)) {
            const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
            const metadata = JSON.parse(metadataContent)
            
            this.vectorData = {
              vectors: [],
              metadata: metadata,
              index_info: {
                total_vectors: metadata.length,
                vector_dimension: 0,
                index_type: 'text-only'
              }
            }
          }
        }
      }
      
      this.isInitialized = true
    } catch (error) {
      console.error('❌ 初始化向量搜索失败:', error)
      this.vectorData = null
      this.isInitialized = true
    }
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    await this.initialize()
    
    if (!this.vectorData || this.vectorData.metadata.length === 0) {
      return []
    }

    try {
      // 如果有向量数据，使用向量搜索
      if (this.vectorData.vectors.length > 0) {
        return await this.vectorSearch(query, topK)
      } else {
        // 否则使用文本搜索
        return this.textSearch(query, topK)
      }
    } catch (error) {
      console.error('❌ 搜索过程出错:', error)
      return this.textSearch(query, topK)
    }
  }

  private async vectorSearch(query: string, topK: number): Promise<SearchResult[]> {
    if (!this.vectorData || this.vectorData.vectors.length === 0) {
      return []
    }

    try {
      console.log('🔍 执行向量搜索...')
      
      // 1. 将查询转换为向量
      const queryVector = await embedText(query)
      
      // 2. 计算与所有文档向量的相似度
      const similarities = this.vectorData.vectors.map((docVector, index) => ({
        index,
        similarity: this.cosineSimilarity(queryVector, docVector),
        metadata: this.vectorData!.metadata[index]
      }))
      
      // 3. 排序并返回top-k结果
      similarities.sort((a, b) => b.similarity - a.similarity)
      
      const results = similarities
        .slice(0, topK)
        .filter(item => item.similarity > 0.1) // 过滤低相似度结果
        .map(item => {
          const doc = item.metadata
          if (isRagDocument(doc)) {
            return {
              text: doc.text,
              metadata: doc.metadata,
              score: item.similarity
            }
          } else if (isProfessorMetadata(doc)) {
            return {
              text: `${doc.name} - ${doc.fields?.join(', ') || ''}`,
              metadata: doc,
              score: item.similarity
            }
          } else {
            throw new Error('Unknown document format')
          }
        })

      console.log(`✅ 向量搜索找到 ${results.length} 个相关结果`)
      return results
      
    } catch (error) {
      console.error('❌ 向量搜索失败:', error)
      return this.textSearch(query, topK)
    }
  }

  private textSearch(query: string, topK: number): SearchResult[] {
    if (!this.vectorData) return []
    
    console.log('🔍 执行文本搜索...')
    
    const queryLower = query.toLowerCase()
    
    const results: SearchResult[] = this.vectorData.metadata
      .map(doc => {
        let text = ''
        let metadata: ProfessorMetadata
        let score = 0
        
        // 处理不同的数据格式
        if (isRagDocument(doc)) {
          text = doc.text
          metadata = doc.metadata
        } else if (isProfessorMetadata(doc)) {
          text = `${doc.name} - ${doc.fields?.join(', ') || ''}`
          metadata = doc
        } else {
          return null // 跳过无效格式
        }
        
        const textLower = text.toLowerCase()
        
        // 关键词匹配 (权重: 3)
        if (metadata.keywords) {
          metadata.keywords.forEach((keyword: string) => {
            if (queryLower.includes(keyword.toLowerCase())) {
              score += 3
            }
          })
        }
        
        // 研究领域匹配 (权重: 4)
        if (metadata.fields) {
          metadata.fields.forEach((field: string) => {
            if (queryLower.includes(field.toLowerCase())) {
              score += 4
            }
          })
        }
        
        // 姓名匹配 (权重: 5)
        if (metadata.name && (
            queryLower.includes(metadata.name.toLowerCase()) || 
            (metadata.name_en && queryLower.includes(metadata.name_en.toLowerCase()))
        )) {
          score += 5
        }
        
        // 文本内容匹配 (权重: 2)
        const words = queryLower.split(/\s+/)
        words.forEach(word => {
          if (word.length > 2 && textLower.includes(word)) {
            score += 2
          }
        })
        
        // 精确短语匹配 (权重: 6)
        if (textLower.includes(queryLower)) {
          score += 6
        }
        
        return {
          text,
          metadata,
          score
        }
      })
      .filter((result): result is SearchResult => result !== null && result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    console.log(`✅ 文本搜索找到 ${results.length} 个相关结果`)
    return results
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
    
    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
  }

  // 获取搜索模式信息
  getSearchMode(): string {
    if (!this.vectorData) return 'uninitialized'
    return this.vectorData.vectors.length > 0 ? 'vector' : 'text'
  }

  // 获取数据库统计信息
  getStats() {
    if (!this.vectorData) return null
    
    return {
      totalDocuments: this.vectorData.index_info.total_vectors,
      vectorDimension: this.vectorData.index_info.vector_dimension,
      indexType: this.vectorData.index_info.index_type,
      searchMode: this.getSearchMode()
    }
  }
}

// 导出实例
export const faissVectorSearch = new FaissVectorSearch() 