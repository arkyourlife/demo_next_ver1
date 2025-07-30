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

export class VectorSearch {
  private documents: RagDocument[] = []
  private faissIndex: any = null
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
      
      console.log(`Loaded ${this.documents.length} professor documents`)
      this.isInitialized = true
    } catch (error) {
      console.error('Error initializing vector search:', error)
      this.documents = []
      this.isInitialized = true
    }
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    await this.initialize()
    
    if (this.documents.length === 0) {
      return []
    }

    try {
      // 简化版本：使用文本相似度匹配（生产环境应使用FAISS）
      const queryLower = query.toLowerCase()
      
      const results: SearchResult[] = this.documents
        .map(doc => {
          // 计算简单的文本相似度分数
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
    } catch (error) {
      console.error('Error in vector search:', error)
      return []
    }
  }

  async searchWithEmbedding(query: string, topK: number = 5): Promise<SearchResult[]> {
    // 这里可以实现真正的向量搜索
    // 由于faiss-node在Node.js环境中可能有兼容性问题，先使用简化版本
    return this.search(query, topK)
  }
}

// 单例实例
export const vectorSearch = new VectorSearch() 