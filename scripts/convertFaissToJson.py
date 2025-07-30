#!/usr/bin/env python3
"""
将 FAISS 索引转换为 JSON 格式，供 Node.js 应用使用
"""

import faiss
import numpy as np
import json
import os
import sys

def convert_faiss_to_json(faiss_path, metadata_path, output_path):
    """
    将 FAISS 索引和元数据转换为 JSON 格式
    """
    try:
        # 加载 FAISS 索引
        print(f"正在加载 FAISS 索引: {faiss_path}")
        index = faiss.read_index(faiss_path)
        
        # 获取所有向量
        print("正在提取向量数据...")
        vectors = index.reconstruct_n(0, index.ntotal)
        
        # 加载元数据
        print(f"正在加载元数据: {metadata_path}")
        with open(metadata_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        # 构建输出数据
        output_data = {
            "vectors": vectors.tolist(),  # 转换为列表格式
            "metadata": metadata,
            "index_info": {
                "total_vectors": int(index.ntotal),
                "vector_dimension": int(index.d),
                "index_type": str(type(index))
            }
        }
        
        # 保存为 JSON
        print(f"正在保存到: {output_path}")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print("✅ 转换完成！")
        print(f"总向量数: {index.ntotal}")
        print(f"向量维度: {index.d}")
        
        return True
        
    except Exception as e:
        print(f"❌ 转换失败: {e}")
        return False

def main():
    # 设置文件路径
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(base_dir)
    
    # 输入文件（您的 FAISS 文件）
    faiss_path = os.path.join(project_root, "professor_index.faiss")
    metadata_path = os.path.join(project_root, "professor_metadata.json")
    
    # 输出文件
    output_path = os.path.join(project_root, "data", "vectors_with_metadata.json")
    
    # 检查输入文件
    if not os.path.exists(faiss_path):
        print(f"❌ FAISS 文件不存在: {faiss_path}")
        print("请将您的 professor_index.faiss 文件放在项目根目录")
        return
    
    if not os.path.exists(metadata_path):
        print(f"❌ 元数据文件不存在: {metadata_path}")
        print("请将您的 professor_metadata.json 文件放在项目根目录")
        return
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 执行转换
    print("🚀 开始转换 FAISS 索引...")
    success = convert_faiss_to_json(faiss_path, metadata_path, output_path)
    
    if success:
        print(f"🎉 转换成功！向量数据已保存到: {output_path}")
        print("\n下一步:")
        print("1. 重启 Next.js 开发服务器")
        print("2. 应用将自动使用新的向量数据进行搜索")
    else:
        print("💡 转换失败，请检查文件路径和格式")

if __name__ == "__main__":
    main() 