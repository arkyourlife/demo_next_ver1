import OpenAI from 'openai'
import { config } from '@/lib/config'

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
})

export async function embedText(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: config.openai.embeddingModel,
      input: text,
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Error creating embedding:', error)
    throw new Error('Failed to create embedding')
  }
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  try {
    const embeddings: number[][] = []
    
    // 批量处理，避免API限制
    for (const text of texts) {
      const embedding = await embedText(text)
      embeddings.push(embedding)
    }
    
    return embeddings
  } catch (error) {
    console.error('Error creating embeddings:', error)
    throw new Error('Failed to create embeddings')
  }
}

export async function chatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  temperature: number = 0.2
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.chatModel,
      messages,
      temperature,
      max_tokens: 2000,
    })
    
    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('Error in chat completion:', error)
    throw new Error('Failed to get chat completion')
  }
} 