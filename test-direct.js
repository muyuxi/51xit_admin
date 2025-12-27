import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.SILICONFLOW_API_KEY;

console.log('测试API调用...');
console.log('密钥前缀:', apiKey?.substring(0, 15) + '...');
console.log('密钥长度:', apiKey?.length);
console.log('');

async function test() {
  try {
    const response = await axios.post(
      'https://api.siliconflow.cn/v1/chat/completions',
      {
        model: 'Qwen/Qwen3-8B',
        messages: [
          { role: 'user', content: '请用"水"这个字组3个词语' }
        ],
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✓ API调用成功!');
    console.log('响应:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('✗ API调用失败');
    console.error('错误:', error.response?.data || error.message);
    console.error('状态码:', error.response?.status);
  }
}

test();
