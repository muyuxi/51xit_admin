# 51习题 - 学前班认字学习系统 API

这是一个基于 Node.js 和 SiliconFlow AI 的学前班认字学习系统后端API，帮助5-6岁儿童学习汉字、组词和造句。

## 功能特性

- 🔤 **根据汉字获取词语** - 输入单个汉字，生成10个适合学前班儿童的常用词语
- 📝 **根据文字生成句子** - 输入汉字或词语,生成5个简单易懂的句子
- 📖 **词语详细解释** - 获取词语的儿童友好解释和例句
- 🎯 **综合学习接口** - 一次性获取词语和句子，提高学习效率

## 技术栈

- **运行环境**: Node.js (ES Module)
- **Web框架**: Express.js
- **AI服务**: SiliconFlow API (Qwen/Qwen3-8B模型)
- **HTTP客户端**: Axios
- **环境配置**: Dotenv

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

`.env` 文件已经配置好，包含了您的API密钥。

### 3. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 启动。

## API 接口文档

### 1. 健康检查

**接口**: `GET /health`

**功能**: 检查服务是否正常运行

**响应示例**:
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "2025-12-27T08:00:00.000Z"
}
```

### 2. 获取词语列表

**接口**: `GET /api/words/:character`

**功能**: 根据单个汉字生成适合学前班儿童学习的词语

**参数**:
- `character`: 单个汉字

**示例请求**:
```bash
curl http://localhost:3000/api/words/水
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "character": "水",
    "words": [
      "水果",
      "喝水",
      "河水",
      "水杯",
      "水池",
      "雨水",
      "水壶",
      "水花",
      "清水",
      "水面"
    ],
    "count": 10
  }
}
```

### 3. 获取句子列表

**接口**: `GET /api/sentences/:text`

**功能**: 根据汉字或词语生成简单易懂的句子

**参数**:
- `text`: 汉字或词语

**示例请求**:
```bash
# 单个汉字
curl http://localhost:3000/api/sentences/水

# 词语
curl http://localhost:3000/api/sentences/水果
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "text": "水果",
    "sentences": [
      "我最喜欢吃苹果和香蕉。",
      "妈妈买了很多新鲜的水果。",
      "每天吃水果对身体很好。",
      "这个西瓜又大又甜。",
      "幼儿园的水果真好吃。"
    ],
    "count": 5
  }
}
```

### 4. 获取词语解释

**接口**: `GET /api/word/explain/:word`

**功能**: 获取词语的详细解释和例句

**参数**:
- `word`: 词语

**示例请求**:
```bash
curl http://localhost:3000/api/word/explain/水果
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "word": "水果",
    "explanation": "水果是指可以吃的、有营养的果实,比如苹果、香蕉、橙子等。",
    "examples": [
      "妈妈给我买了很多水果。",
      "我最喜欢吃的水果是草莓。"
    ]
  }
}
```

### 5. 综合学习接口

**接口**: `POST /api/learn`

**功能**: 一次性获取词语和句子，提高学习效率

**请求体**:
```json
{
  "character": "水"
}
```

**示例请求**:
```bash
curl -X POST http://localhost:3000/api/learn \
  -H "Content-Type: application/json" \
  -d '{"character":"水"}'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "character": "水",
    "words": [
      "水果", "喝水", "河水", "水杯", "水池",
      "雨水", "水壶", "水花", "清水", "水面"
    ],
    "sentences": [
      "我每天都要喝很多水。",
      "小鱼在水里快乐地游泳。",
      "妈妈用水浇花。",
      "河里的水清清的。",
      "下雨了,天上落下水滴。"
    ]
  }
}
```

## 错误处理

所有接口在出错时都会返回统一格式的错误信息：

```json
{
  "success": false,
  "message": "错误描述"
}
```

常见错误码：
- `400`: 请求参数错误
- `404`: 接口不存在
- `500`: 服务器内部错误

## 项目结构

```
51xit_admin/
├── src/
│   ├── controllers/         # 控制器层
│   │   └── learningController.js
│   ├── routes/             # 路由层
│   │   └── learningRoutes.js
│   ├── services/           # 服务层
│   │   └── aiService.js   # AI服务调用
│   └── index.js           # 应用入口
├── .env                   # 环境变量配置
├── .gitignore            # Git忽略文件
├── package.json          # 项目配置
└── README.md            # 项目文档
```

## 环境变量说明

`.env` 文件中的配置项：

```env
# SiliconFlow API密钥
SILICONFLOW_API_KEY=your_api_key_here

# 服务器端口（默认3000）
PORT=3000

# 运行环境
NODE_ENV=development
```

## 开发建议

1. **提示词优化**: 可以根据实际效果调整 `aiService.js` 中的提示词，以获得更适合儿童的内容
2. **缓存机制**: 对于相同的汉字查询，可以添加缓存来提高响应速度和降低API调用成本
3. **内容过滤**: 可以添加内容审核机制，确保返回的内容适合儿童
4. **数据统计**: 可以记录常用汉字和词语，优化学习内容推荐

## 使用场景

1. **微信小程序后端**: 作为学前班认字小程序的API服务
2. **Web应用**: 为网页版学习应用提供数据接口
3. **移动应用**: 为iOS/Android应用提供后端支持

## 注意事项

- API密钥已配置在 `.env` 文件中，请妥善保管
- 建议在生产环境中使用环境变量或密钥管理服务
- 可以根据实际需求调整返回的词语和句子数量
- AI生成内容可能存在不确定性，建议进行内容审核

## License

ISC
