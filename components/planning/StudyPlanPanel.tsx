'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Target,
  BookOpen,
  FileText,
  Award,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'
import { StudyPlan, PlanStep } from '@/types'
import { formatDate } from '@/lib/utils'

interface StudyPlanPanelProps {
  studyPlan?: StudyPlan
}

const defaultPlan: StudyPlan = {
  id: '1',
  title: '日本经营学修士申请计划',
  targetCountry: '日本',
  targetMajor: '经营学',
  targetDegree: '修士',
  universities: [],
  requirements: {
    language: 'JLPT N1 或 TOEFL 85+',
    standardTest: '根据学校要求',
    gpa: '3.5+',
    experience: '实习或研究经历'
  },
  progress: 35,
  createdAt: new Date(),
  updatedAt: new Date(),
  timeline: [
    {
      id: '1',
      title: '日语能力提升',
      description: '准备并通过JLPT N1考试',
      deadline: new Date(2024, 5, 30),
      completed: true,
      priority: 'high',
      category: 'exam'
    },
    {
      id: '2',
      title: 'TOEFL考试准备',
      description: '准备并参加TOEFL考试，目标85+分',
      deadline: new Date(2024, 7, 15),
      completed: false,
      priority: 'high',
      category: 'exam'
    },
    {
      id: '3',
      title: '研究计划书撰写',
      description: '根据目标教授的研究方向撰写研究计划书',
      deadline: new Date(2024, 8, 30),
      completed: false,
      priority: 'high',
      category: 'document'
    },
    {
      id: '4',
      title: '推荐信准备',
      description: '联系教授或导师，准备推荐信',
      deadline: new Date(2024, 10, 1),
      completed: false,
      priority: 'high',
      category: 'document'
    },
    {
      id: '5',
      title: '申请材料提交',
      description: '提交完整的申请材料',
      deadline: new Date(2024, 11, 15),
      completed: false,
      priority: 'high',
      category: 'application'
    }
  ]
}

export default function StudyPlanPanel({ studyPlan = defaultPlan }: StudyPlanPanelProps) {
  const [selectedTab, setSelectedTab] = useState('timeline')
  const [tasks, setTasks] = useState(studyPlan.timeline)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<string>('')
  const [showGeneratedPlan, setShowGeneratedPlan] = useState(false)

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: {
            name: '李同学',
            applicationDirection: '经营学修士',
            graduationUniversity: '中国海洋大学',
            major: '日语专业',
            thesisTitle: '日本企业文化研究',
            japaneseScore: '备考中',
            englishScore: 'TOEFL 85分',
            departureDate: '2024年10月',
            expectedGoal: '希望进入一流国立大学'
          },
          targetCountry: studyPlan.targetCountry,
          targetMajor: studyPlan.targetMajor,
          targetDegree: studyPlan.targetDegree,
          currentStage: '准备阶段'
        }),
      })

      if (!response.ok) {
        throw new Error('生成计划失败')
      }

      const data = await response.json()
      
      if (data.success) {
        setGeneratedPlan(data.plan)
        setShowGeneratedPlan(true)
        
        // 可以在这里更新任务列表
        // setTasks(parsePlanToTasks(data.parsedPlan))
        
        console.log('AI生成的个性化考学计划:', data.plan)
      } else {
        throw new Error(data.error || '生成计划失败')
      }
      
    } catch (error) {
      console.error('生成计划失败:', error)
      alert('生成计划失败，请稍后再试。')
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500' 
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exam': return <Award className="w-4 h-4" />
      case 'application': return <FileText className="w-4 h-4" />
      case 'document': return <BookOpen className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const upcomingTasks = tasks
    .filter(task => !task.completed && new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  const completedTasksCount = tasks.filter(task => task.completed).length
  const progressPercentage = Math.round((completedTasksCount / tasks.length) * 100)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            学习规划
          </CardTitle>
          
          {/* AI生成计划按钮 */}
          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI生成计划
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={progressPercentage} className="flex-1" />
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="px-4 pb-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full">
              <TabsTrigger value="timeline" className="flex-1">时间线</TabsTrigger>
              <TabsTrigger value="overview" className="flex-1">概览</TabsTrigger>
              {showGeneratedPlan && (
                <TabsTrigger value="ai-plan" className="flex-1">AI计划</TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <TabsContent value="timeline" className="mt-0">
            {/* AI生成提示 */}
            {isGenerating && (
              <Card className="mb-4 border-dashed border-2 border-purple-300 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
                    <div>
                      <div className="font-medium text-purple-900">AI正在生成个性化考学计划...</div>
                      <div className="text-sm text-purple-700 mt-1">
                        正在分析您的背景信息，制定最适合的申请时间规划
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 生成成功提示 */}
            {showGeneratedPlan && !isGenerating && (
              <Card className="mb-4 border-2 border-green-300 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">AI计划生成完成！</div>
                      <div className="text-sm text-green-700 mt-1">
                        个性化考学计划已生成，请查看"AI计划"标签页
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <Card 
                  key={task.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    task.completed ? 'bg-green-50 border-green-200' : ''
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(task.category)}
                        <h4 className={`font-medium ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority === 'high' ? '高' : 
                           task.priority === 'medium' ? '中' : '低'}优先级
                        </Badge>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        task.completed ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        截止日期: {formatDate(task.deadline)}
                        {new Date(task.deadline) < new Date() && !task.completed && (
                          <Badge variant="destructive" className="text-xs">
                            已逾期
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="mt-0">
            <div className="space-y-4">
              {/* AI生成按钮说明 */}
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">AI智能规划</h4>
                    <p className="text-sm text-purple-700">
                      点击右上角的"AI生成计划"按钮，系统将根据您的个人信息、目标院校和专业方向，
                      智能生成最适合的申请时间规划和准备策略。
                    </p>
                  </div>
                </div>
              </Card>

              {/* 计划概要 */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">申请目标</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">目标国家:</span>
                    <div className="font-medium">{studyPlan.targetCountry}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">目标专业:</span>
                    <div className="font-medium">{studyPlan.targetMajor}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">学位类型:</span>
                    <div className="font-medium">{studyPlan.targetDegree}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">创建时间:</span>
                    <div className="font-medium">{formatDate(studyPlan.createdAt)}</div>
                  </div>
                </div>
              </Card>

              {/* 申请要求 */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">申请要求</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">语言要求:</span>
                    <div className="font-medium">{studyPlan.requirements.language}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">标准化考试:</span>
                    <div className="font-medium">{studyPlan.requirements.standardTest}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">GPA要求:</span>
                    <div className="font-medium">{studyPlan.requirements.gpa}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">经历要求:</span>
                    <div className="font-medium">{studyPlan.requirements.experience}</div>
                  </div>
                </div>
              </Card>

              {/* 即将到来的任务 */}
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  即将到来的任务
                </h4>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 text-sm">
                        <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                        <span className="flex-1">{task.title}</span>
                        <span className="text-gray-500">{formatDate(task.deadline)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">暂无即将到来的任务</p>
                )}
              </Card>

              {/* 进度统计 */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">进度统计</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completedTasksCount}</div>
                    <div className="text-xs text-gray-500">已完成</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{tasks.length - completedTasksCount}</div>
                    <div className="text-xs text-gray-500">待完成</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
                    <div className="text-xs text-gray-500">完成率</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* AI生成的计划标签页 */}
          {showGeneratedPlan && (
            <TabsContent value="ai-plan" className="mt-0">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium">AI生成的个性化留学规划</h4>
                </div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {generatedPlan}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  此计划由AI根据您的个人背景生成，仅供参考。建议结合实际情况进行调整。
                </div>
              </Card>
            </TabsContent>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 