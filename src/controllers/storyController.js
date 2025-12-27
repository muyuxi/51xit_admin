import aiService from '../services/aiService.js';

class StoryController {
  /**
   * 生成教育故事
   * POST /api/story/generate
   */
  async generateStory(req, res) {
    try {
      const { name, gender, purpose, scene } = req.body;

      // 验证输入
      if (!name || !gender || !purpose || !scene) {
        return res.status(400).json({
          success: false,
          message: '请提供完整的故事参数（name, gender, purpose, scene）'
        });
      }

      // 验证性别参数
      if (gender !== 'boy' && gender !== 'girl') {
        return res.status(400).json({
          success: false,
          message: 'gender 参数必须是 boy 或 girl'
        });
      }

      console.log(`[故事生成] 开始生成故事 - 主人公:${name}, 性别:${gender}, 目的:${purpose}, 场景:${scene}`);

      const result = await aiService.generateStory({
        name,
        gender,
        purpose,
        scene
      });

      console.log(`[故事生成] 成功 - 标题: ${result.title}`);

      res.json({
        success: true,
        data: {
          title: result.title,
          story: result.story,
          params: {
            name,
            gender,
            purpose,
            scene
          }
        }
      });
    } catch (error) {
      console.error('生成故事失败:', error);
      res.status(500).json({
        success: false,
        message: '生成故事失败，请稍后重试'
      });
    }
  }
}

export default new StoryController();
