import express from 'express';
import learningController from '../controllers/learningController.js';

const router = express.Router();

/**
 * @route   GET /api/words/:character
 * @desc    根据单个汉字获取词语列表
 * @params  character - 单个汉字
 * @example GET /api/words/水
 */
router.get('/words/:character', learningController.getWords);

/**
 * @route   GET /api/sentences/:text
 * @desc    根据汉字或词语获取句子列表
 * @params  text - 汉字或词语
 * @example GET /api/sentences/水
 * @example GET /api/sentences/水果
 */
router.get('/sentences/:text', learningController.getSentences);

/**
 * @route   GET /api/character/explain/:character
 * @desc    获取单个汉字的简单解释（适合学龄前儿童）
 * @params  character - 单个汉字
 * @example GET /api/character/explain/水
 */
router.get('/character/explain/:character', learningController.getCharacterExplanation);

/**
 * @route   GET /api/word/explain/:word
 * @desc    获取词语的详细解释和例句
 * @params  word - 词语
 * @example GET /api/word/explain/水果
 */
router.get('/word/explain/:word', learningController.getWordExplanation);

/**
 * @route   POST /api/learn
 * @desc    综合学习接口 - 一次性获取词语和句子
 * @body    { character: "水" }
 * @example POST /api/learn
 */
router.post('/learn', learningController.comprehensiveLearn);

export default router;
