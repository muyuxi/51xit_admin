#!/usr/bin/env node

/**
 * SiliconFlow API 测试脚本
 * 用于验证API密钥和模型配置是否正确
 */

import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const API_KEY = process.env.SILICONFLOW_API_KEY;
const BASE_URL = 'https://api.siliconflow.cn/v1';

// 常见的Qwen模型名称列表（用于测试）
const MODELS_TO_TEST = [
  'Qwen/Qwen3-8B',
  'Qwen/Qwen2.5-7B-Instruct',
  'Qwen/Qwen2.5-72B-Instruct',
  'Qwen/Qwen2-7B-Instruct',
];

async function testAPI() {
  console.log('='.repeat(60));
  console.log('SiliconFlow API 测试');
  console.log('='.repeat(60));
  console.log('');

  // 检查API密钥
  console.log('1. 检查API密钥配置');
  console.log('-'.repeat(60));
  if (!API_KEY) {
    console.error('❌ 错误: 未找到API密钥');
    console.log('请确保在.env文件中配置了SILICONFLOW_API_KEY');
    return;
  }
  console.log('✓ API密钥已配置');
  console.log(`  密钥前缀: ${API_KEY.substring(0, 10)}...`);
  console.log(`  密钥长度: ${API_KEY.length} 字符`);
  console.log('');

  // 测试不同的模型
  console.log('2. 测试API调用');
  console.log('-'.repeat(60));

  for (const model of MODELS_TO_TEST) {
    console.log(`\n正在测试模型: ${model}`);

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        {
          model: model,
          messages: [
            { role: 'user', content: '你好,请回复"测试成功"' }
          ],
          stream: false,
          max_tokens: 50
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log(`✓ 模型 ${model} 测试成功`);
      console.log(`  响应: ${response.data.choices[0].message.content}`);

      // 第一个成功的模型就退出
      console.log('');
      console.log('='.repeat(60));
      console.log(`✓ 建议使用模型: ${model}`);
      console.log('='.repeat(60));
      return;

    } catch (error) {
      if (error.response) {
        console.log(`✗ 失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log(`✗ 失败: 无法连接到服务器`);
      } else {
        console.log(`✗ 失败: ${error.message}`);
      }
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('❌ 所有模型测试均失败');
  console.log('='.repeat(60));
  console.log('');
  console.log('可能的原因:');
  console.log('1. API密钥无效或已过期');
  console.log('2. 账户余额不足');
  console.log('3. API密钥权限不足');
  console.log('4. 网络连接问题');
  console.log('');
  console.log('建议操作:');
  console.log('1. 登录 SiliconFlow 控制台检查API密钥');
  console.log('2. 确认账户余额充足');
  console.log('3. 重新生成API密钥');
  console.log('4. 查看官方文档: https://docs.siliconflow.cn/');
}

// 运行测试
testAPI().catch(console.error);
