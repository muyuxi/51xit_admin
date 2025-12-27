# API 密钥配置说明

## 问题诊断

经过测试,您提供的 API 密钥显示为无效。错误信息: `Api key is invalid`

## 解决步骤

### 1. 检查 SiliconFlow 控制台

请访问 SiliconFlow 官网并登录您的账户:
- 官网: https://cloud.siliconflow.cn/
- 控制台: https://cloud.siliconflow.cn/account/ak

### 2. 验证 API 密钥

在控制台中检查以下内容:
- ✓ API 密钥是否有效(未被删除或禁用)
- ✓ API 密钥权限是否正确
- ✓ 账户余额是否充足
- ✓ API 密钥是否有使用限制

### 3. 获取新的 API 密钥

如果密钥无效,请按以下步骤操作:

1. 登录 SiliconFlow 控制台
2. 进入"API 密钥管理"页面
3. 创建新的 API 密钥
4. 复制新密钥并更新 `.env` 文件

### 4. 更新配置文件

将新的 API 密钥更新到 `.env` 文件中:

```env
SILICONFLOW_API_KEY=你的新密钥
PORT=3000
NODE_ENV=development
```

### 5. 测试 API

运行测试脚本验证密钥是否有效:

```bash
node test-api.js
```

如果测试成功,您将看到类似输出:
```
✓ 模型 Qwen/Qwen2.5-7B-Instruct 测试成功
  响应: 测试成功
```

### 6. 启动服务

密钥验证通过后,启动服务器:

```bash
npm start
```

## 常见问题

### Q: API 密钥从哪里获取?
A: 登录 https://cloud.siliconflow.cn/account/ak 创建和管理 API 密钥

### Q: 如何确认密钥是否有效?
A: 运行 `node test-api.js` 进行测试

### Q: 模型名称是什么?
A: 测试脚本会自动尝试多个常见模型,包括:
   - Qwen/Qwen3-8B
   - Qwen/Qwen2.5-7B-Instruct
   - Qwen/Qwen2.5-72B-Instruct

### Q: API 调用失败怎么办?
A: 检查以下几点:
   1. 密钥是否正确配置在 .env 文件中
   2. 账户余额是否充足
   3. 网络连接是否正常
   4. 模型名称是否正确

## 联系支持

如果问题仍未解决,请联系 SiliconFlow 官方支持:
- 官方文档: https://docs.siliconflow.cn/
- 技术支持: support@siliconflow.cn
