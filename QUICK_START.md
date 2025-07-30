# 🚀 快速开始指南

## 回答您的两个问题

### ❓ 问题1：关于 `professor_index.faiss` 文件
**回答**：您说得对！当前项目确实**没有真正使用**您的FAISS向量文件。

- **当前状态**: 使用简化的文本匹配搜索
- **解决方案**: 我已经创建了完整的向量搜索系统
- **位置**: 查看 `VECTOR_DATABASE_SETUP.md` 了解详情

### ❓ 问题2：OpenAI API Key 设置位置
**回答**：需要在项目根目录创建 `.env.local` 文件。

- **文件位置**: `/home/dizhihuang/takumi/demo_next_ver1/.env.local`
- **详细步骤**: 查看 `API_KEY_SETUP.md` 了解详情

---

## ⚡ 3分钟快速设置

### 第1步：设置API Key（必需）
```bash
# 在项目根目录创建环境变量文件
cd /home/dizhihuang/takumi/demo_next_ver1
touch .env.local

# 编辑文件并添加您的API Key
nano .env.local
```

在 `.env.local` 中添加：
```bash
OPENAI_API_KEY=您的实际API_Key_这里
OPENAI_CHAT_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
RAG_INDEX_PATH=./data/professor_index.faiss
RAG_METADATA_PATH=./data/professor_metadata.json
NODE_ENV=development
```

### 第2步：启用向量搜索（可选但推荐）
```bash
# 将您的FAISS文件复制到项目根目录
cp /path/to/your/professor_index.faiss ./
cp /path/to/your/professor_metadata.json ./

# 运行转换脚本
python scripts/convertFaissToJson.py

# 如果缺少依赖，先安装：
# pip install faiss-cpu numpy
```

### 第3步：启动项目
```bash
npm run dev
```

项目将在 http://localhost:3000 启动

## 🧪 功能测试

### 测试1：基础对话
在聊天框输入："你好，我想了解日本留学"

### 测试2：教授搜索 
在聊天框输入："东京大学计算机专业的教授有哪些？"

### 测试3：个人资料
点击右上角"个人主页"按钮，编辑您的信息

### 测试4：AI计划生成
在考学计划面板点击"AI生成计划"按钮

## 📊 系统状态检查

启动项目后，查看控制台输出来了解系统状态：

### ✅ 完美状态（向量搜索模式）
```
🔍 加载FAISS向量数据...
✅ 成功加载 1234 个向量
🔍 搜索相关教授信息...
🔍 执行向量搜索...
✅ 向量搜索找到 3 个相关结果
```

### ⚠️ 良好状态（文本搜索模式）
```
⚠️  未找到向量数据文件，使用文本匹配模式
💡 提示：运行 python scripts/convertFaissToJson.py 来启用向量搜索
🔍 执行文本搜索...
✅ 文本搜索找到 2 个相关结果
```

### ❌ 需要修复（API Key问题）
```
❌ Chat API error: OPENAI_API_KEY is required
```

## 📂 最终文件结构

设置完成后，您的项目应该是这样：

```
demo_next_ver1/
├── .env.local                    # ← API Key配置
├── professor_index.faiss         # ← 您的FAISS文件（可选）
├── professor_metadata.json      # ← 您的元数据文件（可选）
├── data/
│   ├── professor_metadata.json  # ← 示例数据
│   └── vectors_with_metadata.json # ← 转换后的向量数据（自动生成）
├── scripts/
│   └── convertFaissToJson.py    # ← 转换脚本
├── app/, components/, lib/       # ← 项目代码
└── README.md, package.json, ... # ← 其他项目文件
```

## 🎯 完整功能列表

完成设置后，您将拥有：

### 🤖 AI聊天系统
- ✅ GPT-4o 智能对话
- ✅ 专业留学咨询提示词
- ✅ 教授信息自动检索
- ✅ 文件上传支持

### 🔍 搜索系统
- ✅ 向量搜索（如果设置了FAISS）
- ✅ 文本搜索（备用模式）
- ✅ 多维度匹配算法
- ✅ 实时搜索反馈

### 📋 计划生成
- ✅ 个性化AI规划
- ✅ 基于用户背景分析
- ✅ 详细时间线规划
- ✅ 风险评估建议

### 👤 用户管理
- ✅ 完整个人资料系统
- ✅ 可编辑用户信息
- ✅ 数据持久化存储

## 🆘 需要帮助？

如果遇到问题，请查看详细文档：

- 📖 **API Key设置**: `API_KEY_SETUP.md`
- 🔍 **向量数据库**: `VECTOR_DATABASE_SETUP.md`
- 📚 **功能介绍**: `FEATURES.md`
- 🔧 **完整设置**: `SETUP_GUIDE.md`

或者查看控制台输出中的错误信息进行排障。

---

## 🎉 恭喜！

设置完成后，您就拥有了一个功能完整的AI留学规划助手！

**主要特色**：
- 🧠 基于GPT-4o的智能对话
- 🔍 您的教授数据库检索
- 📋 个性化规划生成
- 🎨 现代化用户界面

**现在就开始体验吧！** 🚀 