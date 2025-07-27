'use client'

import React, { useState } from 'react'
import ChatInterface from '@/components/chat/ChatInterface'
import UniversityPanel from '@/components/planning/UniversityPanel'
import StudyPlanPanel from '@/components/planning/StudyPlanPanel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { University, StudyPlan } from '@/types'

export default function Home() {
  const [universities, setUniversities] = useState<University[]>([])
  const [studyPlan, setStudyPlan] = useState<StudyPlan | undefined>()

  const handleUniversityRecommend = (newUniversities: University[]) => {
    setUniversities(newUniversities)
  }

  const handlePlanUpdate = (newPlan: StudyPlan) => {
    setStudyPlan(newPlan)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部标题栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                留学规划助手
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI智能留学咨询平台 - 为您的留学梦想保驾护航
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                AI助手在线
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* 左侧：聊天机器人 */}
          <div className="flex flex-col">
            <ChatInterface 
              onUniversityRecommend={handleUniversityRecommend}
              onPlanUpdate={handlePlanUpdate}
            />
          </div>

          {/* 右侧：院校推荐和学习规划 */}
          <div className="flex flex-col">
            <Tabs defaultValue="universities" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="universities" className="flex items-center gap-2">
                  🏫 目标院校
                  {universities.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                      {universities.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  📋 考学计划
                </TabsTrigger>
              </TabsList>

              <div className="flex-1">
                <TabsContent value="universities" className="h-full m-0">
                  <UniversityPanel universities={universities} />
                </TabsContent>

                <TabsContent value="planning" className="h-full m-0">
                  <StudyPlanPanel studyPlan={studyPlan} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-500 border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <p>© 2024 留学规划助手 - 基于AI的智能留学咨询平台</p>
          <p className="mt-1">
            提示：本平台提供的信息仅供参考，具体申请要求请以官方信息为准
          </p>
        </div>
      </footer>
    </div>
  )
} 