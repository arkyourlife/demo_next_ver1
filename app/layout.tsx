import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '留学规划助手 - AI智能留学咨询',
  description: '基于AI的智能留学规划和院校数据库检索平台，为您提供个性化的留学建议和院校匹配',
  keywords: '留学规划,留学咨询,AI留学助手,院校查询,留学申请',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 