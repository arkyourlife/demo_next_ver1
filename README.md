# 留学规划助手 - AI智能留学咨询平台

基于Next.js 14和AI技术构建的智能留学规划和院校数据库检索平台，为留学生提供个性化的留学建议和院校匹配服务。

## ✨ 功能特性

### 🤖 AI聊天机器人
- 智能留学咨询对话
- 个性化留学建议
- 实时问答解决方案
- 多轮对话上下文理解

### 🏫 院校推荐系统
- 基于条件的院校匹配
- 详细的院校信息展示
- 申请要求和学费信息
- 院校收藏和对比功能
- 匹配度评分系统

### 📋 学习规划管理
- 个性化时间线规划
- 任务进度跟踪
- 申请要求清单
- 进度统计和可视化
- 即将到期任务提醒

## 🎨 界面设计

- **现代化UI设计**：使用Tailwind CSS构建响应式界面
- **双面板布局**：左侧聊天机器人，右侧功能面板
- **优雅的动画效果**：平滑的交互动画和过渡效果
- **多主题支持**：支持亮色和暗色主题切换

## 🛠 技术栈

### 前端框架
- **Next.js 14** - React全栈框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript

### UI组件
- **Tailwind CSS** - 实用优先的CSS框架
- **Radix UI** - 无头UI组件库
- **Lucide React** - 美观的SVG图标库
- **Class Variance Authority** - 组件变体管理

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS处理工具
- **Autoprefixer** - CSS前缀自动添加

## 📁 项目结构

```
demo_next_ver1/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   └── scroll-area.tsx
│   ├── chat/             # 聊天相关组件
│   │   └── ChatInterface.tsx
│   └── planning/         # 规划相关组件
│       ├── UniversityPanel.tsx
│       └── StudyPlanPanel.tsx
├── lib/                  # 工具函数
│   └── utils.ts
├── types/               # TypeScript类型定义
│   └── index.ts
├── public/              # 静态资源
├── package.json         # 项目依赖
├── tailwind.config.ts   # Tailwind配置
├── tsconfig.json        # TypeScript配置
├── next.config.js       # Next.js配置
└── README.md           # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm 或 yarn

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 [http://localhost:3000](http://localhost:3000) 启动

### 构建生产版本

```bash
npm run build
npm start
```

## 📚 主要组件说明

### ChatInterface 聊天机器人组件
- 处理用户消息输入和AI回复
- 支持多种消息类型（文本、院校推荐、规划更新）
- 实现打字机效果和消息动画
- 支持快捷键操作（Enter发送，Shift+Enter换行）

### UniversityPanel 院校推荐面板
- 展示AI推荐的院校列表
- 提供院校详细信息查看
- 支持院校收藏和筛选功能
- 包含申请要求和学费信息

### StudyPlanPanel 学习规划面板
- 显示个性化的留学时间规划
- 任务列表管理和进度跟踪
- 提供申请要求概览
- 进度统计和可视化展示

## 🎯 核心功能流程

1. **用户咨询**：在聊天界面输入留学相关问题
2. **AI分析**：系统分析用户需求并生成回复
3. **院校推荐**：基于用户条件推荐合适院校
4. **规划生成**：创建个性化的留学时间规划
5. **进度跟踪**：监控申请进度和任务完成情况

## 🔧 自定义和扩展

### 添加新的UI组件
在 `components/ui/` 目录下创建新组件，遵循现有的设计模式。

### 扩展聊天功能
修改 `ChatInterface.tsx` 中的 `generateBotResponse` 函数来添加新的AI回复逻辑。

### 添加新的数据类型
在 `types/index.ts` 中定义新的TypeScript接口。

### 样式定制
修改 `tailwind.config.ts` 和 `app/globals.css` 来调整主题和样式。

## 📄 许可证

本项目仅用于学习和演示目的。

## 🤝 贡献

欢迎提交Issues和Pull Requests来改进项目！

---

*留学规划助手 - 让留学申请更加智能和高效！*