# 留学规划助手 - AI智能留学咨询平台

基于Next.js 14和AI技术构建的智能留学规划和院校数据库检索平台，为留学生提供个性化的留学建议和院校匹配服务。

## ✨ 功能特性

### 🤖 AI聊天机器人
- 智能留学咨询对话
- 个性化留学建议
- 实时问答解决方案
- 多轮对话上下文理解
- **🆕 RAG教授数据库检索**：自动检索相关教授信息
- **🆕 文件上传支持**：支持图片和文档作为对话context

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
- **🆕 AI智能计划生成**：基于个人背景生成定制化规划

### 👤 个人信息管理
- **🆕 完整的个人资料系统**
- **🆕 可编辑的用户信息**
- **🆕 个性化数据存储**

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

### 后端技术
- **OpenAI GPT-4o** - 主要LLM模型
- **RAG向量检索** - 教授信息检索系统
- **Next.js API Routes** - 后端API接口

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
│   ├── api/               # 后端API路由
│   │   ├── chat/         # 聊天API
│   │   └── generate-plan/ # 计划生成API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   ├── chat/             # 聊天相关组件
│   ├── planning/         # 规划相关组件
│   └── profile/          # 个人资料组件
├── lib/                  # 工具函数和服务
│   ├── services/         # 业务服务
│   │   ├── openai.ts    # OpenAI服务
│   │   └── prompts.ts   # 系统提示词
│   ├── rag/             # RAG检索系统
│   │   └── vectorSearch.ts
│   ├── config.ts        # 配置管理
│   └── utils.ts         # 工具函数
├── data/                 # 数据文件
│   └── professor_metadata.json # 教授数据
├── types/               # TypeScript类型定义
│   └── index.ts
└── 配置文件...
```

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm 或 yarn
- OpenAI API Key

### 环境配置

1. 创建 `.env.local` 文件：
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Models Configuration
OPENAI_CHAT_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Database Configuration  
RAG_INDEX_PATH=./data/professor_index.faiss
RAG_METADATA_PATH=./data/professor_metadata.json

# App Configuration
NODE_ENV=development
```

### 安装依赖

```bash
npm install
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

## 📚 主要功能说明

### 🤖 AI聊天系统

**后端实现**：
- `/api/chat` - 主聊天API
- 集成OpenAI GPT-4o模型
- 支持RAG教授信息检索
- 智能判断回复类型
- 支持文件上传context

**系统提示词**：
- 专业的留学规划助手角色
- 详细的服务原则和对话风格
- 支持教授数据库查询
- 个性化建议生成

### 📋 AI计划生成

**后端实现**：
- `/api/generate-plan` - 计划生成API
- 专门的计划生成LLM系统
- 基于用户背景信息定制
- 结构化计划解析

**功能特色**：
- 个性化时间规划
- 风险评估和应对策略
- 月度任务清单
- 成功概率分析

### 🔍 RAG检索系统

**数据结构**：
- 教授基本信息
- 研究领域和关键词
- 联系方式和实验室网站
- 智能匹配算法

**检索逻辑**：
- 关键词匹配（权重：2）
- 研究领域匹配（权重：3）
- 姓名匹配（权重：5）
- 文本内容匹配（权重：1）

## 🎯 核心API说明

### POST /api/chat
聊天接口，支持：
- 消息内容处理
- 文件附件处理
- 对话历史管理
- RAG检索集成
- 智能回复生成

### POST /api/generate-plan
计划生成接口，支持：
- 用户背景分析
- 个性化计划生成
- 结构化数据解析
- 风险评估分析

## 🔧 自定义和扩展

### 添加新的教授数据
编辑 `data/professor_metadata.json` 文件：
```json
{
  "id": "prof_new",
  "text": "教授介绍文本...",
  "metadata": {
    "name": "教授姓名",
    "name_en": "Professor Name",
    "fields": ["研究领域"],
    "keywords": ["关键词"],
    "lab_url": "实验室网站",
    "email": "邮箱地址"
  }
}
```

### 修改系统提示词
编辑 `lib/services/prompts.ts` 文件中的：
- `STUDY_ABROAD_ASSISTANT_PROMPT` - 聊天助手提示词
- `PLAN_GENERATOR_PROMPT` - 计划生成提示词

### 扩展API功能
在 `app/api/` 目录下创建新的路由文件。

## 📝 使用说明

### 基本操作
1. **智能对话**：在聊天框输入留学相关问题
2. **文件上传**：点击输入框上方的按钮上传文件
3. **个人资料**：点击右上角按钮管理个人信息
4. **AI规划**：在规划面板点击"AI生成计划"按钮

### 高级功能
- **教授检索**：询问如"东京大学计算机专业的教授有哪些？"
- **个性化规划**：基于个人背景生成定制化申请计划
- **进度跟踪**：管理申请任务和时间节点

## 🔐 安全注意事项

- API Key 存储在环境变量中，不会暴露给前端
- 用户上传的文件只在会话期间临时存储
- 所有API调用都有错误处理和验证

## 🤝 贡献指南

欢迎提交Issues和Pull Requests来改进项目！

## 📄 许可证

本项目仅用于学习和演示目的。

---

*留学规划助手 - 让留学申请更加智能和高效！*