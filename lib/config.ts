export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4o',
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
  },
  rag: {
    indexPath: process.env.RAG_INDEX_PATH || './data/professor_index.faiss',
    metadataPath: process.env.RAG_METADATA_PATH || './data/professor_metadata.json',
  },
  app: {
    isDevelopment: process.env.NODE_ENV === 'development',
  }
}

// 验证必要的环境变量
export function validateConfig() {
  if (!config.openai.apiKey) {
    throw new Error('OPENAI_API_KEY is required')
  }
} 