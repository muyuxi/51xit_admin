// 首先加载环境变量配置
import './config/env.js';

import express from 'express';
import cors from 'cors';
import learningRoutes from './routes/learningRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api', learningRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/story', storyRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   51习题 - 学前班认字学习系统 API服务        ║
╚═══════════════════════════════════════════════╝

✓ 服务器启动成功
✓ 运行端口: ${PORT}
✓ 运行环境: ${process.env.NODE_ENV || 'development'}
✓ 访问地址: http://localhost:${PORT}

可用接口:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GET  /health                         - 健康检查
  GET  /api/words/:character           - 获取词语
  GET  /api/sentences/:text            - 获取句子
  GET  /api/character/explain/:character - 汉字解释(学前儿童)
  GET  /api/word/explain/:word         - 词语解释
  POST /api/learn                      - 综合学习
  POST /api/story/generate             - 生成教育故事
  POST /api/tts                        - 文本转语音 (TTS)
  GET  /api/tts/status                 - TTS服务状态

示例:
  curl http://localhost:${PORT}/api/words/水
  curl http://localhost:${PORT}/api/sentences/水果
  curl -X POST http://localhost:${PORT}/api/learn -H "Content-Type: application/json" -d '{"character":"水"}'
  curl -X POST http://localhost:${PORT}/api/tts -H "Content-Type: application/json" -d '{"text":"你好"}' --output audio.mp3
`);
});

export default app;
