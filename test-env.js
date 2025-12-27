import dotenv from 'dotenv';
dotenv.config();

console.log('========================================');
console.log('环境变量加载测试');
console.log('========================================');
console.log('API密钥:', process.env.SILICONFLOW_API_KEY);
console.log('密钥前缀:', process.env.SILICONFLOW_API_KEY?.substring(0, 15) + '...');
console.log('密钥长度:', process.env.SILICONFLOW_API_KEY?.length);
console.log('========================================');
