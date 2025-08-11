import { Pinecone } from '@pinecone-database/pinecone'
import { config } from '@/lib/config'

export interface PineconeSearchResult {
  text: string
  metadata: Record<string, any>
  score: number
}

export class PineconeSearch {
  private client: Pinecone | null = null
  private isReady = false

  private ensureClient() {
    if (this.isReady) return
    const apiKey = config.rag.pinecone.apiKey
    const indexName = config.rag.pinecone.indexName
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is required for Pinecone search')
    }
    if (!indexName) {
      throw new Error('PINECONE_INDEX is required for Pinecone search')
    }
    this.client = new Pinecone({ apiKey })
    this.isReady = true
  }

  async search(query: string, topK?: number): Promise<PineconeSearchResult[]> {
    this.ensureClient()
    const client = this.client!
    const index = client.index(config.rag.pinecone.indexName)
    const k = topK ?? config.rag.pinecone.topK

    // 让 Pinecone 用服务器端已有向量，直接按文本字段做 sparse 不现实，这里使用 text 字段转 embedding 的方案
    // 但为了最简集成，我们假设向量已在索引中（通过上传脚本），只需要用查询文本的嵌入进行 query。
    // 这里不在此文件创建嵌入，直接让前置逻辑传入 embedding 会更干净；
    // 为了不侵入更多代码，直接在此进行一次嵌入仍需 openai 依赖。为保持模块职责，改为由调用方传 embedding 更好。
    // 为最小改动，复用本地回退逻辑：简单使用 metadata.text 字段做关键字过滤已不适合。故这里直接执行向量查询，需要 embedding。
    throw new Error('Use queryVector() with precomputed embedding to search Pinecone')
  }

  async queryVector(embedding: number[], topK?: number): Promise<PineconeSearchResult[]> {
    this.ensureClient()
    const client = this.client!
    const index = client.index(config.rag.pinecone.indexName)
    const k = topK ?? config.rag.pinecone.topK

    const ns = config.rag.pinecone.namespace
    const res = await index.namespace(ns).query({
      topK: k,
      vector: embedding,
      includeMetadata: true,
      includeValues: false,
    })

    const results: PineconeSearchResult[] = (res.matches || []).map(m => ({
      text: (m.metadata?.text as string) || '',
      metadata: m.metadata as any,
      score: m.score ?? 0,
    }))
    return results
  }
}

export const pineconeSearch = new PineconeSearch()

