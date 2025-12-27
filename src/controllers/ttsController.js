/**
 * TTS 语音合成控制器
 */

import baiduTtsService from '../services/baiduTtsService.js';

class TtsController {
  /**
   * 文本转语音接口
   * POST /api/tts
   * Body: { text: "要朗读的文本" }
   */
  async textToSpeech(req, res) {
    try {
      const { text, voice = 4, speed = 5 } = req.body;

      // 参数校验
      if (!text || typeof text !== 'string') {
        return res.status(400).json({
          success: false,
          message: '请提供要合成的文本'
        });
      }

      if (text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '文本内容不能为空'
        });
      }

      // 检查服务是否配置
      if (!baiduTtsService.isConfigured()) {
        return res.status(500).json({
          success: false,
          message: '语音服务未配置，请联系管理员'
        });
      }

      console.log(`[TTS] 合成请求: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);

      // 调用百度TTS服务
      const audioBuffer = await baiduTtsService.textToSpeech(text, {
        per: voice,  // 音色 (4=情感女声，适合儿童)
        spd: speed,  // 语速 (5=正常速度)
        vol: 9       // 音量 (9=较大音量)
      });

      // 返回音频流
      res.set({
        'Content-Type': 'audio/mp3',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=86400' // 缓存1天
      });

      res.send(audioBuffer);

      console.log(`[TTS] 合成成功: ${audioBuffer.length} 字节`);
    } catch (error) {
      console.error('[TTS] 合成失败:', error.message);

      res.status(500).json({
        success: false,
        message: error.message || '语音合成失败'
      });
    }
  }

  /**
   * 检查TTS服务状态
   * GET /api/tts/status
   */
  async checkStatus(req, res) {
    try {
      const isConfigured = baiduTtsService.isConfigured();

      if (!isConfigured) {
        return res.json({
          success: false,
          message: '语音服务未配置',
          configured: false
        });
      }

      // 尝试获取 Access Token 来验证配置是否正确
      try {
        await baiduTtsService.getAccessToken();
        res.json({
          success: true,
          message: '语音服务正常',
          configured: true
        });
      } catch (error) {
        res.json({
          success: false,
          message: '语音服务配置错误: ' + error.message,
          configured: true,
          error: error.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '检查服务状态失败',
        error: error.message
      });
    }
  }
}

export default new TtsController();
