# 51习题 - 学前班认字学习系统 API

## 服务器信息
- 运行端口: 3000
- 基础URL: http://localhost:3000

## 可用接口

### 1. 健康检查
```bash
GET /health
```
返回示例：
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "2025-12-27T08:51:56.634Z"
}
```

### 2. 获取词语
根据单个汉字生成10个适合学前班儿童学习的词语。

```bash
GET /api/words/:character
```

示例：
```bash
curl http://localhost:3000/api/words/水
```

返回示例：
```json
{
  "success": true,
  "data": {
    "character": "水",
    "words": ["喝水", "游泳", "河流", "雨水", "大海", "湖水", "冰水", "泉水", "海水", "露水"],
    "count": 10
  }
}
```

### 3. 获取句子
根据汉字或词语生成5个简单的句子。

```bash
GET /api/sentences/:text
```

示例：
```bash
curl http://localhost:3000/api/sentences/水果
```

返回示例：
```json
{
  "success": true,
  "data": {
    "text": "水果",
    "sentences": [
      "水果真好吃，我喜欢吃苹果。",
      "妈妈买了橘子，我们一起来分享。",
      "吃水果能让我们长得更高更健康。",
      "我每天都会吃一个香蕉，身体棒棒的。",
      "水果颜色鲜艳，里面有好多营养。"
    ],
    "count": 5
  }
}
```

### 4. 词语解释
获取词语的详细解释和例句。

```bash
GET /api/word/explain/:word
```

示例：
```bash
curl http://localhost:3000/api/word/explain/水果
```

返回示例：
```json
{
  "success": true,
  "data": {
    "word": "水果",
    "explanation": "水果是从树上或植物上摘下来的，可以吃的小东西，味道甜甜的或者酸酸的，对身体有好处。",
    "examples": [
      "妈妈买了苹果和香蕉，这些都是水果。",
      "小明喜欢吃橘子，橘子是一种水果。",
      "今天我们吃了一个大的西瓜，它也是水果哦。"
    ]
  }
}
```

### 5. 综合学习
一次性获取汉字的词语和句子，适合综合学习使用。

```bash
POST /api/learn
Content-Type: application/json
```

请求体：
```json
{
  "character": "水"
}
```

示例：
```bash
curl -X POST http://localhost:3000/api/learn \
  -H "Content-Type: application/json" \
  -d '{"character":"水"}'
```

返回示例：
```json
{
  "success": true,
  "data": {
    "character": "水",
    "words": ["水壶", "水杯", "河水", "湖水", "雨水", "海水", "泉水", "喝水", "冷水", "热水"],
    "sentences": [
      "小鱼在水里快乐地游来游去。",
      "妈妈给我洗了香香的水澡。",
      "水壶里的水喝完要记得关紧。",
      "水池边的小花在水滴下更漂亮。",
      "水是生命的重要东西，要珍惜。"
    ]
  }
}
```

## 启动服务器

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 开发模式（自动重启）
npm run dev
```

## 环境配置

在项目根目录创建 `.env` 文件：
```
SILICONFLOW_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

## 技术栈
- Node.js (ES Modules)
- Express.js
- Axios
- SiliconFlow AI API (Qwen/Qwen3-8B)
