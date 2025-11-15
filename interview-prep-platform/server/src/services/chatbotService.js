const { GoogleGenerativeAI } = require('@google/generative-ai');
const { tavily } = require('@tavily/core');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Tutor system prompt
const TUTOR_PROMPT = `You are an expert AI tutor for "TheTrueTest" - an interview preparation platform.

Your expertise covers:
- Data Structures & Algorithms (DSA) - Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Dynamic Programming
- Operating Systems (OS) - Process Management, Memory Management, Scheduling, Deadlocks, File Systems
- SQL & Database Queries - SELECT, JOIN, GROUP BY, Subqueries, Indexing
- Database Management Systems (DBMS) - Normalization, ACID, Transactions, Concurrency Control
- Computer Networks - OSI Model, TCP/IP, HTTP, DNS, Routing, Network Security
- System Design - Scalability, Load Balancing, Microservices, Caching, Database Design
- Machine Learning (ML) - Supervised/Unsupervised Learning, Regression, Classification, Model Evaluation
- Deep Learning (DL) - Neural Networks, CNN, RNN, LSTM, Transfer Learning
- Generative AI - LLMs, Transformers, Prompt Engineering, RAG
- Aptitude & Reasoning - Logical Reasoning, Quantitative Aptitude, Data Interpretation

Your teaching style:
1. Clear, concise explanations (200-400 words max)
2. Use examples and real-world analogies
3. Provide code snippets when relevant (Python/JavaScript preferred)
4. Break down complex topics step-by-step
5. Encourage practice and suggest quizzes
6. Be supportive and motivating
7. Use emojis sparingly (1-2 per response)

Response format:
- Brief answer first
- Detailed explanation with examples
- Code example if applicable (with comments)
- End with practice suggestion or related topic

When students ask for resources, inform them that you can search for the latest YouTube videos, articles, and tutorials.

Remember: You're preparing students for technical interviews. Focus on interview-relevant concepts and common interview questions.`;

class ChatbotService {
  constructor() {
    // Use gemini-pro model (most stable)
    this.model = genAI.getGenerativeModel({
      model: 'gemini-pro',
    });

    this.systemInstruction = TUTOR_PROMPT;

    this.generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1000,
    };

    this.safetySettings = [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ];
  }

  /**
   * Send message to Gemini AI with conversation history
   */
  async chat(userMessage, conversationHistory = []) {
    try {
      // Prepend system instruction as first user message
      const promptWithContext = `${this.systemInstruction}\n\nUser: ${userMessage}\n\nAssistant:`;
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptWithContext }] }],
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
      });

      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text,
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Search resources using Tavily
   */
  async searchResources(query) {
    try {
      const searchResponse = await tavilyClient.search(query, {
        searchDepth: 'advanced',
        maxResults: 6,
        includeAnswer: true,
        includeImages: false,
        includeImageDescriptions: false,
        includeDomains: [
          'youtube.com',
          'geeksforgeeks.org',
          'leetcode.com',
          'github.com',
          'stackoverflow.com',
          'medium.com',
          'dev.to',
          'freecodecamp.org',
          'w3schools.com',
          'tutorialspoint.com',
        ],
      });

      if (!searchResponse || !searchResponse.results) {
        return { success: false, resources: [] };
      }

      // Format and categorize results
      const resources = searchResponse.results.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.content?.substring(0, 250) || 'No description available',
        score: result.score,
        type: this.categorizeResource(result.url),
      }));

      return {
        success: true,
        resources,
        summary: searchResponse.answer || null,
      };
    } catch (error) {
      console.error('Tavily Search Error:', error);
      throw new Error('Failed to search resources');
    }
  }

  /**
   * Categorize resource type based on URL
   */
  categorizeResource(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
    if (url.includes('github.com')) return 'code';
    if (url.includes('stackoverflow.com')) return 'qna';
    return 'article';
  }

  /**
   * Detect if user is asking for resources
   */
  isResourceQuery(message) {
    const resourceKeywords = [
      'resource',
      'article',
      'tutorial',
      'video',
      'course',
      'learn more',
      'documentation',
      'guide',
      'example',
      'github',
      'youtube',
      'blog',
      'read about',
      'find',
      'search',
      'link',
      'reference',
      'study material',
      'best resources',
      'where can i learn',
    ];

    const lowerMessage = message.toLowerCase();
    return resourceKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Detect topic from user message
   */
  detectTopic(message) {
    const topics = {
      DSA: ['dsa', 'algorithm', 'data structure', 'array', 'tree', 'graph', 'linked list', 'stack', 'queue', 'sorting', 'searching', 'dynamic programming', 'recursion'],
      OS: ['os', 'operating system', 'process', 'thread', 'deadlock', 'scheduling', 'memory management', 'paging', 'segmentation'],
      SQL: ['sql', 'query', 'select', 'join', 'database query', 'where', 'group by'],
      DBMS: ['dbms', 'database', 'normalization', 'transaction', 'acid', 'indexing', 'relational'],
      Networks: ['network', 'tcp', 'ip', 'http', 'osi', 'dns', 'routing', 'subnet'],
      'System Design': ['system design', 'scalability', 'architecture', 'microservices', 'load balancing', 'caching', 'cdn'],
      ML: ['machine learning', 'ml', 'supervised', 'unsupervised', 'regression', 'classification', 'clustering'],
      DL: ['deep learning', 'dl', 'neural network', 'cnn', 'rnn', 'lstm', 'backpropagation'],
      'Gen-AI': ['generative ai', 'gen-ai', 'llm', 'gpt', 'transformer', 'prompt', 'chatbot'],
      Aptitude: ['aptitude', 'reasoning', 'logical', 'puzzle', 'quantitative'],
    };

    const lowerMessage = message.toLowerCase();

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return topic;
      }
    }

    return null;
  }

  /**
   * Generate quick action suggestions
   */
  getQuickActions(message) {
    const actions = [];
    const topic = this.detectTopic(message);

    // Add quiz practice action if topic detected
    if (topic) {
      actions.push({
        type: 'quiz',
        label: `Practice ${topic} Quiz`,
        topic: topic,
        icon: '📝',
      });
    }

    // Add resource search if not already a resource query
    if (!this.isResourceQuery(message) && topic) {
      actions.push({
        type: 'search',
        label: 'Find Resources',
        query: `${topic} interview preparation tutorial`,
        icon: '🔍',
      });
    }

    // Always add dashboard link
    actions.push({
      type: 'navigate',
      label: 'View Dashboard',
      path: '/dashboard',
      icon: '📊',
    });

    return actions.slice(0, 3); // Max 3 actions
  }

  /**
   * Get welcome message
   */
  getWelcomeMessage(userName = 'there') {
    return `👋 Hi ${userName}! I'm your AI Learning Assistant for TheTrueTest.

I can help you with:
• 📚 Explaining programming concepts
• 💻 Solving coding problems
• 🎯 Quiz recommendations  
• 🔍 Finding learning resources (YouTube, articles, tutorials)

**Available Topics:**
DSA • OS • SQL • DBMS • Networks • System Design • ML • DL • Gen-AI • Aptitude

Try asking:
• "Explain binary search algorithm"
• "What is deadlock in OS?"
• "Find resources for system design"
• "Difference between SQL and NoSQL"`;
  }
}

module.exports = new ChatbotService();
