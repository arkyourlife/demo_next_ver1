import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/services/openai'
import { PLAN_GENERATOR_PROMPT, generatePersonalizedPrompt } from '@/lib/services/prompts'
import { validateConfig } from '@/lib/config'

interface GeneratePlanRequest {
  userProfile?: {
    name?: string
    applicationDirection?: string
    graduationUniversity?: string
    major?: string
    thesisTitle?: string
    japaneseScore?: string
    englishScore?: string
    departureDate?: string
    expectedGoal?: string
  }
  targetCountry?: string
  targetMajor?: string
  targetDegree?: string
  currentStage?: string
}

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    validateConfig()
    
    const body: GeneratePlanRequest = await request.json()
    const { 
      userProfile = {}, 
      targetCountry = '日本',
      targetMajor = '计算机科学',
      targetDegree = '修士',
      currentStage = '准备阶段'
    } = body

    // 构建个性化提示词
    const personalizedPrompt = generatePersonalizedPrompt(userProfile)
    
    // 构建完整的提示词
    const fullPrompt = `${PLAN_GENERATOR_PROMPT}

${personalizedPrompt}

## 申请目标
- 目标国家：${targetCountry}
- 目标专业：${targetMajor}  
- 学位类型：${targetDegree}
- 当前阶段：${currentStage}

请生成一份详细的、个性化的留学申请规划，包括：
1. 总体规划概览
2. 分阶段详细计划
3. 月度任务清单
4. 风险评估和应对策略
5. 成功概率分析

请确保计划具体可执行，时间安排合理。`

    console.log('生成个性化留学申请计划...')
    
    // 调用计划生成LLM
    const planResponse = await chatCompletion([
      { role: 'system', content: PLAN_GENERATOR_PROMPT },
      { role: 'user', content: fullPrompt }
    ], 0.1) // 使用较低的temperature确保计划的一致性

    // 解析生成的计划（这里可以添加更复杂的解析逻辑）
    const parsedPlan = parsePlanResponse(planResponse)

    return NextResponse.json({
      success: true,
      plan: planResponse,
      parsedPlan,
      generatedAt: new Date().toISOString(),
      userProfile: userProfile
    })

  } catch (error) {
    console.error('Generate plan API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '计划生成失败，请稍后再试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// 解析计划响应，提取结构化信息
function parsePlanResponse(planText: string) {
  try {
    // 这里可以实现更复杂的解析逻辑
    // 目前返回基本的解析结果
    
    const sections = planText.split('##').filter(section => section.trim())
    
    const parsed = {
      overview: '',
      stages: [] as Array<{
        title: string
        content: string
        duration: string
      }>,
      monthlyTasks: [] as Array<{
        month: string
        tasks: string[]
      }>,
      risks: [] as string[],
      successRate: ''
    }

    sections.forEach(section => {
      const lines = section.trim().split('\n')
      const title = lines[0].trim()
      const content = lines.slice(1).join('\n').trim()

      if (title.includes('总体规划') || title.includes('概览')) {
        parsed.overview = content
      } else if (title.includes('阶段') || title.includes('计划')) {
        parsed.stages.push({
          title,
          content,
          duration: extractDuration(content)
        })
      } else if (title.includes('风险')) {
        parsed.risks = extractRisks(content)
      } else if (title.includes('成功') || title.includes('概率')) {
        parsed.successRate = content
      }
    })

    return parsed
  } catch (error) {
    console.error('Error parsing plan response:', error)
    return {
      overview: planText.substring(0, 200) + '...',
      stages: [],
      monthlyTasks: [],
      risks: [],
      successRate: '需要根据具体情况评估'
    }
  }
}

// 提取时间信息
function extractDuration(content: string): string {
  const durationRegex = /(\d+[-~]\d+个月|\d+个月)/g
  const matches = content.match(durationRegex)
  return matches ? matches[0] : '时间待定'
}

// 提取风险点
function extractRisks(content: string): string[] {
  const risks: string[] = []
  const lines = content.split('\n')
  
  lines.forEach(line => {
    if (line.includes('风险') || line.includes('注意') || line.includes('困难')) {
      risks.push(line.trim())
    }
  })
  
  return risks.length > 0 ? risks : ['需要根据具体情况评估风险点']
} 