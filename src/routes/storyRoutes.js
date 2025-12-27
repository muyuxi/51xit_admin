import express from 'express';
import storyController from '../controllers/storyController.js';

const router = express.Router();

/**
 * @route   POST /api/story/generate
 * @desc    生成教育故事
 * @body    { name: "小明", gender: "boy", purpose: "学会分享", scene: "在幼儿园" }
 * @example POST /api/story/generate
 */
router.post('/generate', storyController.generateStory);

export default router;
