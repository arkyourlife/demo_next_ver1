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
  RefreshCw
} from 'lucide-react'
import { StudyPlan, PlanStep } from '@/types'
import { formatDate } from '@/lib/utils'

interface StudyPlanPanelProps {
  studyPlan?: StudyPlan
}

const defaultPlan: StudyPlan = {
  id: '1',
  title: '美国计算机科学硕士申请计划',
  targetCountry: '美国',
  targetMajor: '计算机科学',
  targetDegree: '硕士',
  universities: [],
  requirements: {
    language: 'TOEFL 100+ 或 IELTS 7.0+',
    standardTest: 'GRE 320+',
    gpa: '3.5+',
    experience: '实习或研究经历'
  },
  progress: 35,
  createdAt: new Date(),
  updatedAt: new Date(),
  timeline: [
    {
      id: '1',
      title: '语言考试准备',
      description: '准备并通过TOEFL或IELTS考试',
      deadline: new Date(2024, 5, 30),
      completed: true,
      priority: 'high',
      category: 'exam'
    },
    {
      id: '2',
      title: 'GRE考试准备',
      description: '准备并参加GRE考试，目标320+',
      deadline: new Date(2024, 7, 15),
      completed: false,
      priority: 'high',
      category: 'exam'
    },
    {
      id: '3',
      title: '实习经历积累',
      description: '在相关公司或实验室积累实习经验',
      deadline: new Date(2024, 8, 30),
      completed: false,
      priority: 'medium',
      category: 'other'
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
      title: '个人陈述撰写',
      description: '撰写个人陈述和研究计划',
      deadline: new Date(2024, 10, 15),
      completed: false,
      priority: 'high',
      category: 'document'
    },
    {
      id: '6',
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
    
    // 模拟调用后端LLM Agent生成计划
    setTimeout(() => {
      console.log('调用LLM Agent生成个性化考学计划...')
      // 这里可以添加实际的API调用
      // const newPlan = await generateStudyPlan(userProfile)
      
      setIsGenerating(false)
      // 可以在这里更新计划状态
      alert('个性化考学计划生成完成！计划已根据您的背景和目标进行优化。')
    }, 3000)
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
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
        </div>
      </CardContent>
    </Card>
  )
} 