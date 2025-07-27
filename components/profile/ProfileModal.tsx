'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  User, 
  Save, 
  Edit3, 
  School, 
  BookOpen, 
  Calendar,
  Target,
  Award,
  Globe
} from 'lucide-react'

interface UserProfile {
  name: string
  applicationDirection: string
  graduationUniversity: string
  major: string
  thesisTitle: string
  japaneseScore: string
  englishScore: string
  departureDate: string
  expectedGoal: string
  avatar?: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const defaultProfile: UserProfile = {
  name: '李同学',
  applicationDirection: '经营学修士',
  graduationUniversity: '中国海洋大学',
  major: '日语专业',
  thesisTitle: '日本企业文化研究',
  japaneseScore: '备考中',
  englishScore: 'TOEFL 85分',
  departureDate: '2024年10月',
  expectedGoal: '希望进入一流国立大学',
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(defaultProfile)

  if (!isOpen) return null

  const handleEdit = () => {
    setEditedProfile(profile)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    // 这里可以添加保存到后端的逻辑
    console.log('保存用户资料:', editedProfile)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const ProfileField = ({ 
    label, 
    value, 
    field, 
    icon: Icon 
  }: { 
    label: string
    value: string
    field: keyof UserProfile
    icon: any 
  }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
      <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600 mb-1">{label}:</div>
        {isEditing ? (
          <Input
            value={editedProfile[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="h-8 text-sm"
          />
        ) : (
          <div className="font-medium text-gray-900">{value}</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              个人信息
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleEdit}
                  className="text-white hover:bg-white/20"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSave}
                    className="text-white hover:bg-white/20"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCancel}
                    className="text-white hover:bg-white/20"
                  >
                    取消
                  </Button>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* 头像和基本信息 */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <Badge className="mt-1">
                {profile.applicationDirection}
              </Badge>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid gap-4">
            <ProfileField
              label="姓名"
              value={profile.name}
              field="name"
              icon={User}
            />
            
            <ProfileField
              label="申请方向"
              value={profile.applicationDirection}
              field="applicationDirection"
              icon={Target}
            />

            <ProfileField
              label="毕业大学"
              value={profile.graduationUniversity}
              field="graduationUniversity"
              icon={School}
            />

            <ProfileField
              label="专业"
              value={profile.major}
              field="major"
              icon={BookOpen}
            />

            <ProfileField
              label="毕业论文题目"
              value={profile.thesisTitle}
              field="thesisTitle"
              icon={BookOpen}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField
                label="日语成绩"
                value={profile.japaneseScore}
                field="japaneseScore"
                icon={Globe}
              />

              <ProfileField
                label="英语成绩"
                value={profile.englishScore}
                field="englishScore"
                icon={Award}
              />
            </div>

            <ProfileField
              label="赴日时间"
              value={profile.departureDate}
              field="departureDate"
              icon={Calendar}
            />

            <ProfileField
              label="预期备注"
              value={profile.expectedGoal}
              field="expectedGoal"
              icon={Target}
            />
          </div>

          {/* 底部操作按钮 */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  保存更改
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 