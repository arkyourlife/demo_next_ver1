# 环境变量设置

请在项目根目录创建 `.env.local` 文件，包含以下内容：

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

## 设置步骤

1. 复制上述内容到 `.env.local` 文件
2. 将 `your_openai_api_key_here` 替换为您的实际 OpenAI API Key
3. 确保 RAG 数据库文件路径正确

## 注意事项

- `.env.local` 文件不会被提交到 git 仓库
- 请妥善保管您的 API Key
- 确保 professor_index.faiss 和 professor_metadata.json 文件在正确位置 