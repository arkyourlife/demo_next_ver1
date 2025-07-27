'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ImageIcon, 
  Paperclip,
  UserCircle,
  X
} from 'lucide-react'
import { Message } from '@/types'
import { generateId } from '@/lib/utils'
import ProfileModal from '@/components/profile/ProfileModal'

interface ChatInterfaceProps {
  onUniversityRecommend?: (universities: any[]) => void
  onPlanUpdate?: (plan: any) => void
}

interface AttachedFile {
  id: string
  name: string
  type: 'image' | 'file'
  url: string
  size?: string
}

export default function ChatInterface({ onUniversityRecommend, onPlanUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是您的留学规划助手。我可以帮助您：\n\n🎓 制定个性化留学计划\n🏫 推荐合适的院校\n📚 解答留学相关问题\n📋 跟踪申请进度\n\n请告诉我您的留学意向，比如想去哪个国家、什么专业？',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          const newFile: AttachedFile = {
            id: generateId(),
            name: file.name,
            type: 'image',
            url: url,
            size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
          }
          setAttachedFiles(prev => [...prev, newFile])
        }
      })
    }
    // 重置input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file)
        const newFile: AttachedFile = {
          id: generateId(),
          name: file.name,
          type: 'file',
          url: url,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
        }
        setAttachedFiles(prev => [...prev, newFile])
      })
    }
    // 重置input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return

    let messageContent = input
    if (attachedFiles.length > 0) {
      const fileInfo = attachedFiles.map(file => 
        `[${file.type === 'image' ? '图片' : '文件'}: ${file.name}]`
      ).join(' ')
      messageContent = input ? `${input}\n\n附件: ${fileInfo}` : `附件: ${fileInfo}`
    }

    const userMessage: Message = {
      id: generateId(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    // 清理附件
    attachedFiles.forEach(file => URL.revokeObjectURL(file.url))
    setAttachedFiles([])
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const botResponse = generateBotResponse(input)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)

      // 如果是院校推荐，触发回调
      if (botResponse.type === 'university-recommendation') {
        onUniversityRecommend?.([
          {
            id: '1',
            name: '斯坦福大学',
            nameEn: 'Stanford University',
            country: '美国',
            city: '斯坦福',
            ranking: { world: 3, country: 2 },
            requirements: { gpa: '3.8+', ielts: '7.0+', gre: '320+' },
            tuition: { local: '$56,169', international: '$56,169' },
            programs: ['计算机科学', '商业管理', '工程学'],
            description: '世界顶尖私立研究型大学',
            website: 'https://www.stanford.edu',
            matchScore: 92
          },
          {
            id: '2',
            name: '加州大学伯克利分校',
            nameEn: 'UC Berkeley',
            country: '美国',
            city: '伯克利',
            ranking: { world: 4, country: 1 },
            requirements: { gpa: '3.7+', ielts: '7.0+', gre: '315+' },
            tuition: { local: '$14,226', international: '$44,007' },
            programs: ['计算机科学', '工程学', '商学'],
            description: '美国顶尖公立研究型大学',
            website: 'https://www.berkeley.edu',
            matchScore: 88
          }
        ])
      }
    }, 1500)
  }

  const generateBotResponse = (userInput: string): Message => {
    const input_lower = userInput.toLowerCase()
    
    if (input_lower.includes('美国') || input_lower.includes('计算机') || input_lower.includes('推荐院校')) {
      return {
        id: generateId(),
        content: '根据您的需求，我为您推荐以下美国计算机科学优秀院校：\n\n📊 已为您生成个性化院校推荐列表，请查看右侧面板获取详细信息。\n\n这些院校都有优秀的计算机科学项目，我已经根据您的背景进行了匹配度评估。您可以点击查看详细的申请要求和项目信息。\n\n还有其他问题吗？比如申请时间规划、语言考试准备等？',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'university-recommendation'
      }
    }

    if (input_lower.includes('规划') || input_lower.includes('时间') || input_lower.includes('计划')) {
      return {
        id: generateId(),
        content: '我来为您制定一份详细的留学规划：\n\n📅 **时间规划建议：**\n\n**现在-6个月后：**\n• 准备语言考试（托福/雅思）\n• 准备标准化考试（GRE/GMAT）\n• 提升GPA，完成核心课程\n\n**6-12个月后：**\n• 准备申请材料\n• 写个人陈述和推荐信\n• 参加实习或研究项目\n\n**12-18个月后：**\n• 提交申请\n• 面试准备\n• 签证申请\n\n我已经更新了您的个人规划，请查看右侧面板了解详情！',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'plan-update'
      }
    }

    // 默认回复
    const responses = [
      '我理解您的情况。能告诉我更多关于您的学术背景和留学目标吗？',
      '这是一个很好的问题！根据您的情况，我建议...',
      '我可以为您提供更详细的信息。您希望了解哪个方面？',
      '基于您的需求，我有几个建议...'
    ]

    return {
      id: generateId(),
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              留学规划助手
              <Badge variant="secondary" className="ml-2">AI助手</Badge>
            </CardTitle>
            
            {/* 右上角个人主页按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              个人主页
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* 文件上传工具栏 */}
          <div className="px-4 pb-2 border-b bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                添加图片
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                添加文件
              </Button>

              {/* 隐藏的文件输入 */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* 已附加文件显示 */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachedFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm"
                  >
                    {file.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="truncate max-w-32">{file.name}</span>
                    <span className="text-xs text-gray-500">({file.size})</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachedFile(file.id)}
                      className="w-4 h-4 p-0 hover:bg-red-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 message-fade-in ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                  {message.type === 'university-recommendation' && (
                    <div className="flex items-center gap-1 mt-2 text-xs opacity-80">
                      <Sparkles className="w-3 h-3" />
                      已生成院校推荐
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 text-gray-900 p-3 rounded-lg">
                  <div className="typing-indicator text-sm">正在思考中...</div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的留学问题..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend}
                disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              按 Enter 发送，Shift + Enter 换行
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 个人主页模态框 */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  )
} 