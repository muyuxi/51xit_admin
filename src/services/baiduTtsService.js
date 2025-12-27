/**
 * 百度语音合成 (TTS) 服务
 * 文档: https://ai.baidu.com/ai-doc/SPEECH/Qknh1b7di
 */

import axios from 'axios';
import querystring from 'querystring';

class BaiduTtsService {
  constructor() {
    this.appId = process.env.BAIDU_TTS_APP_ID;
    this.apiKey = process.env.BAIDU_TTS_API_KEY;
    this.secretKey = process.env.BAIDU_TTS_SECRET_KEY;

    // Access Token 缓存 (有效期30天)
    this.accessToken = null;
    this.tokenExpireTime = 0;

    // API地址
    this.authUrl = 'https://aip.baidubce.com/oauth/2.0/token';
    this.ttsUrl = 'https://tsn.baidu.com/text2audio';
  }

  /**
   * 获取 Access Token
   * Access Token 有效期30天，需要缓存
   */
  async getAccessToken() {
    const now = Date.now();

    // 如果token还在有效期内，直接返回
    if (this.accessToken && now < this.tokenExpireTime) {
      return this.accessToken;
    }

    try {
      const params = {
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.secretKey
      };

      const response = await axios.get(this.authUrl, { params });

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        // 提前5分钟过期，避免边界问题
        this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
        return this.accessToken;
      } else {
        throw new Error('获取百度TTS Access Token失败');
      }
    } catch (error) {
      console.error('百度TTS认证失败:', error.message);
      throw new Error('语音服务认证失败');
    }
  }

  /**
   * 文本转语音
   * @param {string} text - 要合成的文本 (最多1024个GBK字节，约512个汉字)
   * @param {object} options - 可选参数
   * @returns {Buffer} - 音频数据 (MP3格式)
   */
  async textToSpeech(text, options = {}) {
    if (!text || text.trim().length === 0) {
      throw new Error('文本内容不能为空');
    }

    // 检查文本长度 (简单检查，1个汉字≈2字节)
    if (text.length > 512) {
      throw new Error('文本过长，最多支持512个汉字');
    }

    try {
      const token = await this.getAccessToken();

      const params = {
        tok: token,                          // Access Token
        tex: text,                           // 要合成的文本 (必须UTF-8编码)
        cuid: options.cuid || 'miniprogram', // 用户唯一标识
        ctp: 1,                              // 客户端类型 (1=web端)
        lan: options.lan || 'zh',            // 语言 (zh=中文)
        spd: options.spd || 5,               // 语速 (0-15，默认5)
        pit: options.pit || 5,               // 音调 (0-15，默认5)
        vol: options.vol || 9,               // 音量 (0-15，默认9，儿童友好)
        per: options.per || 4,               // 音色 (0=女声,1=男声,3=情感男声,4=情感女声)
        aue: 3                               // 音频格式 (3=mp3, 4=pcm-16k, 5=pcm-8k, 6=wav)
      };

      const response = await axios({
        method: 'POST',
        url: this.ttsUrl,
        data: querystring.stringify(params),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'arraybuffer',         // 重要：接收二进制音频数据
        timeout: 10000                       // 10秒超时
      });

      // 检查响应类型
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('audio')) {
        // 成功返回音频数据
        return Buffer.from(response.data);
      } else {
        // 返回的是错误信息(JSON格式)
        const error = JSON.parse(response.data.toString());
        throw new Error(`百度TTS错误: ${error.err_msg || '未知错误'} (错误码: ${error.err_no})`);
      }
    } catch (error) {
      console.error('百度TTS合成失败:', error.message);

      if (error.response) {
        // 解析错误响应
        try {
          const errorData = JSON.parse(error.response.data.toString());
          throw new Error(`语音合成失败: ${errorData.err_msg} (错误码: ${errorData.err_no})`);
        } catch (e) {
          throw new Error('语音合成失败: 服务器错误');
        }
      }

      throw new Error('语音合成失败: ' + error.message);
    }
  }

  /**
   * 检查服务是否配置完成
   */
  isConfigured() {
    return !!(this.apiKey && this.secretKey);
  }
}

// 创建单例
const baiduTtsService = new BaiduTtsService();

export default baiduTtsService;
