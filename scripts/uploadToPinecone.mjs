#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

// 环境变量
const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_ENV = process.env.PINECONE_ENV || process.env.PINECONE_ENVIRONMENT // 兼容旧变量名
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'professors'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_EMBED_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'

if (!PINECONE_API_KEY) throw new Error('PINECONE_API_KEY 未设置')
if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY 未设置')

// 读取数据，优先 rag_documents.json，其次 professor_metadata.json
const DATA_DIR = path.resolve('./data')
const RAG_DOCS = path.join(DATA_DIR, 'rag_documents.json')
const META_DOCS = path.join(DATA_DIR, 'professor_metadata.json')

function loadDocuments() {
  if (fs.existsSync(RAG_DOCS)) {
    const raw = JSON.parse(fs.readFileSync(RAG_DOCS, 'utf-8'))
    // 直接是 {id,text,metadata}
    return raw
  }
  if (fs.existsSync(META_DOCS)) {
    const metas = JSON.parse(fs.readFileSync(META_DOCS, 'utf-8'))
    // 包装为 RAG 文档
    return metas.map((m, idx) => ({
      id: m.professor_id || String(idx + 1),
      text: `${m.name}（${m.name_en || ''}） - ${(m.fields || []).join('、')}\n关键词：${(m.keywords || []).join('、')}`,
      metadata: m,
    }))
  }
  throw new Error('未找到 data/rag_documents.json 或 data/professor_metadata.json')
}

async function embedBatch(openai, texts) {
  // 简单串行批处理，稳妥起见可以加速为并发+限流
  const vectors = []
  for (const t of texts) {
    const resp = await openai.embeddings.create({ model: OPENAI_EMBED_MODEL, input: t })
    vectors.push(resp.data[0].embedding)
  }
  return vectors
}

async function ensureIndex(pinecone, indexName) {
  // Pinecone v2 SDK 自动管理 index 客户端，但需要保证 index 已创建
  const indexes = await pinecone.listIndexes()
  const exists = indexes.indexes?.some(i => i.name === indexName)
  if (!exists) {
    // 使用默认规格创建，实际可根据需要调整
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // text-embedding-3-small 维度
      metric: 'cosine',
      spec: {
        serverless: { cloud: 'aws', region: PINECONE_ENV || 'us-east-1' },
      },
    })
    // 等待索引就绪
    let ready = false
    while (!ready) {
      const { status } = await pinecone.describeIndex(indexName)
      if (status?.ready) ready = true
      else await new Promise(r => setTimeout(r, 3000))
    }
  }
}

function shortHash(input) {
  return crypto.createHash('sha1').update(String(input)).digest('hex').slice(0, 10)
}

function sanitizeId(input, fallbackKey = '') {
  const original = (input ?? '').toString()
  // 去除非ASCII
  let ascii = original.normalize('NFKD').replace(/[^\x00-\x7F]/g, '')
  // 仅保留 Pinecone 友好的字符集
  ascii = ascii.replace(/[^a-zA-Z0-9_.:-]/g, '-')
  ascii = ascii.replace(/-+/g, '-')
  ascii = ascii.replace(/^[-.]+|[-.]+$/g, '')
  if (!ascii) {
    const base = (fallbackKey || 'doc').toString().replace(/[^a-zA-Z0-9_.:-]/g, '-')
    ascii = base || 'doc'
  }
  // 附加短哈希避免冲突
  const suffix = shortHash(original || fallbackKey)
  let candidate = `${ascii}-${suffix}`
  // 长度控制（Pinecone 限制512，这里保守控制为 128）
  if (candidate.length > 128) {
    candidate = candidate.slice(0, 128)
  }
  return candidate
}

async function main() {
  const docs = loadDocuments()
  console.log(`加载文档 ${docs.length} 条，开始上传到 Pinecone 索引 ${PINECONE_INDEX} ...`)

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
  const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY })

  await ensureIndex(pinecone, PINECONE_INDEX)
  const index = pinecone.index(PINECONE_INDEX)

  // 分批嵌入 + upsert，避免超时/配额
  const batchSize = 50
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize)
    const texts = batch.map(d => d.text)
    const embeddings = await embedBatch(openai, texts)

    const vectors = batch.map((d, j) => ({
      id: sanitizeId(d.id, `${d.metadata?.name_en || d.metadata?.name || 'doc'}_${i + j}`),
      values: embeddings[j],
      metadata: {
        name: d.metadata?.name || d.metadata?.name_jp || '',
        name_en: d.metadata?.name_en || '',
        fields: d.metadata?.fields || d.metadata?.secondary_fields || [],
        keywords: d.metadata?.keywords || d.metadata?.detailed_keywords || [],
        lab_url: d.metadata?.lab_url || d.metadata?.lab_website || '',
        email: d.metadata?.email || '',
        text: d.text,
      },
    }))

    await index.upsert(vectors)
    console.log(`已上传 ${(i + vectors.length)} / ${docs.length}`)
  }

  console.log('上传完成 ✅')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

