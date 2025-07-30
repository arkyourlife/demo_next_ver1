# 🔑 OpenAI API Key 设置指南

## 📍 第一步：创建环境变量文件

在项目根目录 `demo_next_ver1/` 创建 `.env.local` 文件：

```bash
# 方法1: 使用命令行创建
touch .env.local

# 方法2: 使用文本编辑器直接创建
```

## 📍 第二步：添加API Key配置

打开 `.env.local` 文件，添加以下内容：

```bash
# OpenAI Configuration - 请替换为您的实际API Key
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Models Configuration
OPENAI_CHAT_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Database Configuration
RAG_INDEX_PATH=./data/professor_index.faiss
RAG_METADATA_PATH=./data/professor_metadata.json

# App Configuration
NODE_ENV=development
```

## 🔑 获取OpenAI API Key

如果您还没有API Key：

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账户
3. 进入 **API Keys** 页面
4. 点击 **"Create new secret key"**
5. 复制生成的API Key（格式: `sk-proj-...`）

## 📝 设置示例

您的 `.env.local` 文件应该看起来像这样：

```bash
# 示例配置（请使用您的真实API Key）
OPENAI_API_KEY=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

OPENAI_CHAT_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

RAG_INDEX_PATH=./data/professor_index.faiss
RAG_METADATA_PATH=./data/professor_metadata.json

NODE_ENV=development
```

## ✅ 验证设置

### 方法1：启动项目验证
```bash
npm run dev
```

如果配置正确，您会看到：
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

### 方法2：查看控制台输出
打开浏览器访问 http://localhost:3000

在聊天中输入任何消息，查看浏览器开发者工具控制台：

**✅ 成功**:
```
🔍 搜索相关教授信息...
✅ 找到 3 条相关教授信息
```

**❌ 失败**:
```
❌ Chat API error: OpenAI API key is invalid
```

## 🚨 常见问题

### 问题1：API Key无效
**错误**: `Error: OpenAI API key is invalid`

**解决方案**:
1. 检查API Key是否正确复制（不要有多余空格）
2. 确认API Key没有过期
3. 验证账户余额是否足够

### 问题2：环境变量未加载
**错误**: `OPENAI_API_KEY is required`

**解决方案**:
1. 确认文件名是 `.env.local`（不是 `.env`）
2. 确认文件在项目根目录
3. 重启开发服务器

### 问题3：模型访问权限
**错误**: `You don't have access to GPT-4o`

**解决方案**:
1. 检查您的OpenAI账户等级
2. 临时改用GPT-3.5: `OPENAI_CHAT_MODEL=gpt-3.5-turbo`

## 📂 文件位置确认

您的项目结构应该是这样：

```
demo_next_ver1/
├── .env.local              # ← API Key配置文件
├── app/
├── components/
├── lib/
├── data/
│   ├── professor_metadata.json
│   └── vectors_with_metadata.json (可选)
├── professor_index.faiss   # ← 您的FAISS文件 (可选)
├── professor_metadata.json # ← 您的元数据文件 (可选)
└── package.json
```

## 🔒 安全注意事项

1. **不要提交到Git**: `.env.local` 已在 `.gitignore` 中
2. **保护API Key**: 不要在代码中硬编码API Key
3. **定期轮换**: 定期更新API Key
4. **监控使用量**: 关注API调用费用

## 🎯 完整测试流程

1. ✅ 创建 `.env.local` 文件
2. ✅ 添加您的API Key
3. ✅ 启动项目: `npm run dev`
4. ✅ 打开浏览器: http://localhost:3000
5. ✅ 测试对话: "你好，我想了解日本留学"
6. ✅ 测试教授搜索: "东京大学计算机专业的教授有哪些？"
7. ✅ 测试计划生成: 点击"AI生成计划"按钮

---

**设置完成后，您就可以体验完整的AI留学规划助手功能了！** 🎉 