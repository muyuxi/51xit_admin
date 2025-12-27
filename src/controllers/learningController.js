import aiService from '../services/aiService.js';

class LearningController {
  /**
   * 获取词语列表
   * GET /api/words/:character
   */
  async getWords(req, res) {
    try {
      const { character } = req.params;

      // 验证输入
      if (!character || character.length !== 1) {
        return res.status(400).json({
          success: false,
          message: '请提供单个汉字'
        });
      }

      const words = await aiService.getWords(character);

      res.json({
        success: true,
        data: {
          character: character,
          words: words,
          count: words.length
        }
      });
    } catch (error) {
      console.error('获取词语失败:', error);
      res.status(500).json({
        success: false,
        message: '获取词语失败，请稍后重试'
      });
    }
  }

  /**
   * 获取句子列表
   * GET /api/sentences/:text
   */
  async getSentences(req, res) {
    try {
      const { text } = req.params;

      // 验证输入
      if (!text || text.length === 0) {
        return res.status(400).json({
          success: false,
          message: '请提供汉字或词语'
        });
      }

      const sentences = await aiService.getSentences(text);

      res.json({
        success: true,
        data: {
          text: text,
          sentences: sentences,
          count: sentences.length
        }
      });
    } catch (error) {
      console.error('获取句子失败:', error);
      res.status(500).json({
        success: false,
        message: '获取句子失败，请稍后重试'
      });
    }
  }

  /**
   * 获取汉字解释
   * GET /api/character/explain/:character
   */
  async getCharacterExplanation(req, res) {
    try {
      const { character } = req.params;

      // 验证输入
      if (!character || character.length !== 1) {
        return res.status(400).json({
          success: false,
          message: '请提供单个汉字'
        });
      }

      const explanation = await aiService.getCharacterExplanation(character);

      res.json({
        success: true,
        data: {
          character: character,
          explanation: explanation
        }
      });
    } catch (error) {
      console.error('获取汉字解释失败:', error);
      res.status(500).json({
        success: false,
        message: '获取汉字解释失败，请稍后重试'
      });
    }
  }

  /**
   * 获取词语解释和例句
   * GET /api/word/explain/:word
   */
  async getWordExplanation(req, res) {
    try {
      const { word } = req.params;

      // 验证输入
      if (!word || word.length === 0) {
        return res.status(400).json({
          success: false,
          message: '请提供词语'
        });
      }

      const explanation = await aiService.getWordExplanation(word);

      res.json({
        success: true,
        data: {
          word: word,
          ...explanation
        }
      });
    } catch (error) {
      console.error('获取词语解释失败:', error);
      res.status(500).json({
        success: false,
        message: '获取词语解释失败，请稍后重试'
      });
    }
  }

  /**
   * 综合学习接口 - 一次性获取词语和句子
   * POST /api/learn
   */
  async comprehensiveLearn(req, res) {
    try {
      const { character } = req.body;

      // 验证输入
      if (!character || character.length !== 1) {
        return res.status(400).json({
          success: false,
          message: '请提供单个汉字'
        });
      }

      // 并行获取词语和句子
      const [words, sentences] = await Promise.all([
        aiService.getWords(character),
        aiService.getSentences(character)
      ]);

      res.json({
        success: true,
        data: {
          character: character,
          words: words,
          sentences: sentences
        }
      });
    } catch (error) {
      console.error('综合学习失败:', error);
      res.status(500).json({
        success: false,
        message: '获取学习内容失败，请稍后重试'
      });
    }
  }
}

export default new LearningController();
