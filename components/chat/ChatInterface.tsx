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
      content: '您好！我是您的留学规划助手。我可以帮助您：\n\n🎓 制定个性化留学计划\n🏫 推荐合适的院校和教授\n📚 解答留学相关问题\n📋 跟踪申请进度\n\n请告诉我您的留学意向，比如想去哪个国家、什么专业？',
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
    const attachments = attachedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    }))

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

    try {
      // 调用后端API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          attachments: attachments,
          history: messages.slice(-10) // 发送最近10条消息作为上下文
        }),
      })

      if (!response.ok) {
        throw new Error('API调用失败')
      }

      const data = await response.json()
      
      const botResponse: Message = {
        id: generateId(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        type: data.type || 'text'
      }

      setMessages(prev => [...prev, botResponse])
      
      // 如果是院校推荐，触发回调
      if (data.type === 'university-recommendation' && data.universities) {
        onUniversityRecommend?.(data.universities)
      }
      
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: generateId(),
        content: '抱歉，我暂时无法回应。请稍后再试。',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
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
            {/* 文件上传工具栏 - 移到输入框上方 */}
            <div className="flex items-center gap-2 mb-3">
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
              <div className="flex flex-wrap gap-2 mb-3">
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

            {/* 输入框和发送按钮 */}
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