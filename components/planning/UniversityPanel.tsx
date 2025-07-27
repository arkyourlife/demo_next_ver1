'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  School, 
  MapPin, 
  Star, 
  DollarSign, 
  BookOpen, 
  ExternalLink,
  Heart,
  Plus
} from 'lucide-react'
import { University } from '@/types'

interface UniversityPanelProps {
  universities: University[]
}

export default function UniversityPanel({ universities }: UniversityPanelProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedTab, setSelectedTab] = useState('all')

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const filteredUniversities = universities.filter(uni => {
    if (selectedTab === 'favorites') {
      return favorites.has(uni.id)
    }
    return true
  })

  const UniversityCard = ({ university }: { university: University }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{university.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">{university.nameEn}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {university.country} · {university.city}
              </div>
              {university.ranking.world && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  世界排名 #{university.ranking.world}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {university.matchScore && (
              <Badge variant={university.matchScore >= 90 ? 'default' : 'secondary'}>
                匹配度 {university.matchScore}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(university.id)}
              className={favorites.has(university.id) ? 'text-red-500' : ''}
            >
              <Heart className={`w-4 h-4 ${favorites.has(university.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{university.description}</p>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              热门专业
            </h4>
            <div className="flex flex-wrap gap-1">
              {university.programs.slice(0, 3).map((program, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {program}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">申请要求</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>GPA: {university.requirements.gpa}</div>
              {university.requirements.ielts && (
                <div>IELTS: {university.requirements.ielts}</div>
              )}
              {university.requirements.toefl && (
                <div>TOEFL: {university.requirements.toefl}</div>
              )}
              {university.requirements.gre && (
                <div>GRE: {university.requirements.gre}</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              学费信息
            </h4>
            <div className="text-sm">
              <div>国际学生: {university.tuition.international}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Plus className="w-4 h-4 mr-1" />
            加入申请清单
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(university.website, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <School className="w-5 h-5 text-green-600" />
          推荐院校
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="px-4 pb-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                全部 ({universities.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                收藏 ({favorites.size})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedTab === 'favorites' ? (
                <div>
                  <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>还没有收藏的院校</p>
                  <p className="text-sm mt-1">点击院校卡片上的爱心图标来收藏</p>
                </div>
              ) : (
                <div>
                  <School className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无院校推荐</p>
                  <p className="text-sm mt-1">请在左侧聊天中告诉我您的留学需求</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 