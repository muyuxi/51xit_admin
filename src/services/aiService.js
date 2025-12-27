import axios from 'axios';

class AIService {
  constructor() {
    // 延迟获取环境变量，确保在dotenv.config()之后
    this.baseUrl = 'https://api.siliconflow.cn/v1';
    this.model = 'Qwen/Qwen2.5-72B-Instruct';
  }

  get apiKey() {
    return process.env.SILICONFLOW_API_KEY;
  }

  /**
   * 调用SiliconFlow API
   * @param {Array} messages - 对话消息数组
   * @param {boolean} stream - 是否使用流式输出
   * @returns {Promise<string>} - AI返回的内容
   */
  async chat(messages, stream = false) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          stream: stream
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (stream) {
        // 如果是流式输出，返回完整响应
        return response.data;
      } else {
        // 非流式输出，返回消息内容
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error('调用SiliconFlow API出错:', error.response?.data || error.message);
      throw new Error('AI服务调用失败');
    }
  }

  /**
   * 根据单个汉字生成词语
   * @param {string} character - 单个汉字
   * @returns {Promise<Array>} - 词语数组
   */
  async getWords(character) {
    const prompt = `请为汉字"${character}"生成10个包含这个字的常用词语。要求：
1. 【重要】每个词语必须包含"${character}"这个字
2. 词语要简单易懂，适合5-6岁学前班儿童学习
3. 每个词语2-4个字
4. 词语要日常生活中常见的
5. 只返回词语，每行一个，不要添加序号、拼音或其他说明

示例格式（如果是"水"字）：
水果
喝水
河水`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const content = await this.chat(messages);
      // 将返回的内容按行分割，过滤空行
      const words = content.split('\n')
        .map(word => word.trim())
        .filter(word => word && !word.match(/^\d+[.、]/)); // 过滤空行和序号

      // 二次验证：确保返回的词语包含目标字
      const validWords = words.filter(word => word.includes(character));

      return validWords.slice(0, 10); // 确保只返回10个词语
    } catch (error) {
      throw error;
    }
  }

  /**
   * 根据单个汉字或词语生成句子
   * @param {string} text - 汉字或词语
   * @returns {Promise<Array>} - 句子数组
   */
  async getSentences(text) {
    const prompt = `请用"${text}"造10个句子，要求：
1. 【重要】每个句子必须包含"${text}"
2. 句子要简单易懂，适合学前班儿童（5-6岁）理解
3. 句子长度控制在8-15个字
4. 句子内容要贴近儿童日常生活
5. 句子要有教育意义或积极向上的内容
6. 只返回句子，每行一个，不要添加序号或其他说明

示例格式（如果是"水"字）：
我喜欢喝水
水果很好吃
小河里有水`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const content = await this.chat(messages);
      // 将返回的内容按行分割，过滤空行
      const sentences = content.split('\n')
        .map(sentence => sentence.trim())
        .filter(sentence => sentence && !sentence.match(/^\d+[.、]/)); // 过滤空行和序号

      // 二次验证：确保返回的句子包含目标字/词
      const validSentences = sentences.filter(sentence => sentence.includes(text));

      return validSentences.slice(0, 10); // 确保只返回10个句子
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取单个汉字的简单解释（适合学龄前儿童）
   * @param {string} character - 单个汉字
   * @returns {Promise<string>} - 简单解释
   */
  async getCharacterExplanation(character) {
    const prompt = `请用学龄前儿童（5-6岁）能听懂的简单语言，解释汉字"${character}"的意思。要求：
1. 用1-2句话解释，每句话不超过20个字
2. 语言要生动、形象，贴近儿童生活
3. 可以举一个简单的例子帮助理解
4. 不要使用专业术语或复杂的词汇
5. 直接返回解释内容，不要添加"这个字的意思是"等引导语

示例（如果是"水"字）：
水是我们每天都要喝的液体，可以解渴。小河里、水杯里都有水。`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const content = await this.chat(messages);
      return content.trim();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 根据词语生成详细解释和例句（可选功能）
   * @param {string} word - 词语
   * @returns {Promise<Object>} - 包含解释和例句的对象
   */
  async getWordExplanation(word) {
    const prompt = `请为词语"${word}"提供适合学前班儿童理解的解释和例句：
1. 用简单的语言解释这个词语的意思
2. 提供2-3个使用这个词语的简单例句
3. 返回格式为JSON：{"explanation": "解释内容", "examples": ["例句1", "例句2"]}`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const content = await this.chat(messages);
      // 尝试解析JSON
      try {
        // 移除可能的markdown代码块标记
        const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
        return JSON.parse(cleanContent);
      } catch {
        // 如果解析失败，返回原始内容
        return {
          explanation: content,
          examples: []
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 生成教育故事
   * @param {Object} params - 故事参数
   * @param {string} params.name - 主人公名字
   * @param {string} params.gender - 主人公性别 (boy/girl)
   * @param {string} params.purpose - 教育目的
   * @param {string} params.scene - 故事场景
   * @returns {Promise<Object>} - 包含标题和故事内容的对象
   */
  async generateStory({ name, gender, purpose, scene }) {
    const genderText = gender === 'boy' ? '小男孩' : '小女孩';
    const pronoun = gender === 'boy' ? '他' : '她';

    const prompt = `请为学龄前儿童（3-6岁）创作一个教育故事，要求如下：

**故事参数：**
- 主人公：${name}（一个5岁的${genderText}）
- 教育目的：${purpose}
- 故事场景：${scene}

**创作要求：**
1. 故事长度约300字，适合3-5分钟讲完
2. 语言简单易懂，每句话不超过15个字
3. 要有清晰的开始、发展、结尾结构
4. 包含生动的对话，让故事更有趣
5. 教育目的要自然融入故事，不要说教
6. 结局必须积极向上，给孩子正面鼓励
7. 可以使用重复句式帮助记忆
8. 避免任何恐怖、暴力内容
9. 人物性别用"${pronoun}"来称呼

**返回格式（纯JSON，不要markdown标记）：**
{
  "title": "故事标题（6-10字）",
  "story": "故事正文内容"
}

示例标题风格：《${name}学会了分享》、《勇敢的${name}》等`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const content = await this.chat(messages);

      // 清理可能的markdown代码块标记
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();

      try {
        const result = JSON.parse(cleanContent);
        return {
          title: result.title || `${name}的故事`,
          story: result.story || content
        };
      } catch (parseError) {
        // 如果JSON解析失败，尝试提取内容
        console.error('JSON解析失败，返回原始内容:', parseError);
        return {
          title: `${name}的故事`,
          story: content
        };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AIService();
