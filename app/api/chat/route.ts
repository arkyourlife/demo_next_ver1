import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/services/openai'
import { faissVectorSearch } from '@/lib/rag/faissVectorSearch'
import { STUDY_ABROAD_ASSISTANT_PROMPT } from '@/lib/services/prompts'
import { validateConfig } from '@/lib/config'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: string
  type?: string
}

interface ChatRequest {
  message: string
  attachments?: Array<{
    name: string
    type: string
    size?: string
  }>
  history?: ChatMessage[]
}

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    validateConfig()
    
    const body: ChatRequest = await request.json()
    const { message, attachments = [], history = [] } = body

    if (!message && attachments.length === 0) {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 检查是否需要搜索教授信息
    const needsProfessorSearch = shouldSearchProfessors(message)
    let contextDocs: string[] = []
    let searchInfo = null
    
    if (needsProfessorSearch) {
      console.log('🔍 搜索相关教授信息...')
      
      try {
        const searchResults = await faissVectorSearch.search(message, 5)
        contextDocs = searchResults.map(result => result.text)
        
        // 获取搜索统计信息
        const stats = faissVectorSearch.getStats()
        searchInfo = {
          searchMode: faissVectorSearch.getSearchMode(),
          resultsCount: searchResults.length,
          stats: stats
        }
        
        console.log(`✅ 找到 ${contextDocs.length} 条相关教授信息 (模式: ${searchInfo.searchMode})`)
      } catch (error) {
        console.error('❌ 教授信息搜索失败:', error)
        contextDocs = []
      }
    }

    // 构建对话上下文
    const conversationHistory = history.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }))

    // 构建系统提示词
    let systemPrompt = STUDY_ABROAD_ASSISTANT_PROMPT
    
    if (contextDocs.length > 0) {
      systemPrompt += `\n\n## 🎓 教授数据库信息 (${searchInfo?.searchMode === 'vector' ? '向量搜索' : '文本搜索'})\n以下是相关的教授信息，请在回答中优先使用这些信息：\n\n${contextDocs.join('\n\n')}`
    }

    if (attachments.length > 0) {
      const attachmentInfo = attachments.map(att => `${att.name} (${att.type})`).join(', ')
      systemPrompt += `\n\n## 📎 用户上传的文件\n用户上传了以下文件作为参考：${attachmentInfo}`
    }

    // 调用LLM
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ]

    const response = await chatCompletion(messages, 0.3)

    // 判断回复类型
    const responseType = determineResponseType(message, response)

    // 如果是院校推荐，生成示例数据
    let universities = undefined
    if (responseType === 'university-recommendation') {
      universities = generateSampleUniversities()
    }

    return NextResponse.json({
      response,
      type: responseType,
      universities,
      searchInfo: searchInfo, // 包含搜索模式信息
      searchedProfessors: contextDocs.length > 0
    })

  } catch (error) {
    console.error('❌ Chat API error:', error)
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后再试' },
      { status: 500 }
    )
  }
}

// 判断是否需要搜索教授信息
function shouldSearchProfessors(message: string): boolean {
  const professorKeywords = [
    '教授', '导师', '老师', '指导', '研究', '实验室', '研究室',
    'professor', 'supervisor', 'advisor', 'lab', 'research', 'laboratory',
    '计算机', '人工智能', '机器学习', '数据科学', '软件工程', '算法',
    'computer science', 'artificial intelligence', 'machine learning', 'data science',
    '东京大学', '东大', 'Tokyo University', 'UTokyo', '工学部', '情报理工',
    '推荐', '介绍', '找', '联系', '申请'
  ]
  
  const lowerMessage = message.toLowerCase()
  return professorKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  )
}

// 判断回复类型
function determineResponseType(userMessage: string, response: string): string {
  const message = userMessage.toLowerCase()
  
  if (message.includes('推荐') && (message.includes('学校') || message.includes('大学') || message.includes('院校'))) {
    return 'university-recommendation'
  }
  
  if (message.includes('规划') || message.includes('计划') || message.includes('时间表')) {
    return 'plan-update'
  }
  
  return 'text'
}

// 生成示例院校数据
function generateSampleUniversities() {
  return [
    {
      id: '1',
      name: '东京大学',
      nameEn: 'University of Tokyo',
      country: '日本',
      city: '东京',
      ranking: { world: 23, country: 1 },
      requirements: { gpa: '3.5+', ielts: '7.0+', jlpt: 'N1' },
      tuition: { local: '¥535,800', international: '¥535,800' },
      programs: ['计算机科学', '人工智能', '数据科学'],
      description: '日本顶尖国立大学，在计算机科学和人工智能领域享有盛誉',
      website: 'https://www.u-tokyo.ac.jp',
      matchScore: 95
    },
    {
      id: '2', 
      name: '京都大学',
      nameEn: 'Kyoto University',
      country: '日本',
      city: '京都',
      ranking: { world: 36, country: 2 },
      requirements: { gpa: '3.4+', ielts: '6.5+', jlpt: 'N1' },
      tuition: { local: '¥535,800', international: '¥535,800' },
      programs: ['信息学', '计算机工程', '软件科学'],
      description: '日本历史悠久的顶尖大学，信息学研究实力强劲',
      website: 'https://www.kyoto-u.ac.jp',
      matchScore: 88
    }
  ]
} 