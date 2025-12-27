/**
 * TTS 语音合成路由
 */

import express from 'express';
import ttsController from '../controllers/ttsController.js';

const router = express.Router();

/**
 * @route POST /api/tts
 * @desc 文本转语音
 * @body { text: string, voice?: number, speed?: number }
 * @returns 音频流 (MP3格式)
 */
router.post('/', ttsController.textToSpeech);

/**
 * @route GET /api/tts/status
 * @desc 检查TTS服务状态
 * @returns { success: boolean, message: string, configured: boolean }
 */
router.get('/status', ttsController.checkStatus);

export default router;
