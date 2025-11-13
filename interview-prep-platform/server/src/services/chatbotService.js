const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

class ChatbotService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.tavilyApiKey = process.env.TAVILY_API_KEY;
    
    // Topics covered by the platform
    this.platformTopics = [
      'Data Structures and Algorithms (DSA)',
      'Operating Systems (OS)',
      'SQL and Database Management',
      'Database Management Systems (DBMS)',
      'System Design',
      'Computer Networks',
      'Aptitude and Logical Reasoning',
      'Machine Learning (ML)',
      'Deep Learning (DL)',
      'Generative AI'
    ];
  }

  /**
   * Generate a system prompt for the chatbot
   */
  getSystemPrompt() {
    return `You are an intelligent interview preparation assistant for a platform that helps students prepare for technical interviews.

**Your Role:**
- Help students with doubts and questions related to: ${this.platformTopics.join(', ')}
- Provide clear, concise explanations suitable for interview preparation
- Correct misconceptions in incorrectly phrased questions
- Guide students to the right topic even if they ask vaguely
- Recommend practice questions when appropriate

**Guidelines:**
1. If a question is unclear or incorrect, politely clarify what they might be asking
2. Provide interview-focused answers (concise but complete)
3. Use examples and analogies when helpful
4. If asked about topics outside the platform scope, politely redirect to relevant platform topics
5. Always be encouraging and supportive
6. If you mention external resources, keep them general (specific URLs will be provided by web search)

**Response Format:**
- Keep answers structured and easy to read
- Use bullet points for lists
- Highlight key concepts
- Suggest related topics for further study

Remember: You're helping students prepare for interviews, so focus on practical, interview-relevant knowledge.`;
  }

  /**
   * Search the web using Tavily API for relevant resources
   */
  async searchWebResources(query, topic = '') {
    try {
      if (!this.tavilyApiKey) {
        console.log('Tavily API key not configured');
        return null;
      }

      const searchQuery = topic ? `${topic} ${query} tutorial interview preparation` : `${query} programming interview preparation`;

      const response = await axios.post(
        'https://api.tavily.com/search',
        {
          api_key: this.tavilyApiKey,
          query: searchQuery,
          search_depth: 'basic',
          include_answer: false,
          include_raw_content: false,
          max_results: 5,
          include_domains: [
            'geeksforgeeks.org',
            'leetcode.com',
            'stackoverflow.com',
            'medium.com',
            'dev.to',
            'tutorialspoint.com',
            'w3schools.com',
            'freecodecamp.org',
            'github.com',
            'youtube.com'
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.results) {
        return response.data.results.map(result => ({
          title: result.title,
          url: result.url,
          snippet: result.content || result.snippet || ''
        }));
      }

      return null;
    } catch (error) {
      console.error('Tavily search error:', error.message);
      return null;
    }
  }

  /**
   * Detect the topic from the user's question
   */
  detectTopic(question) {
    const questionLower = question.toLowerCase();
    
    const topicKeywords = {
      'dsa': ['algorithm', 'data structure', 'array', 'linked list', 'tree', 'graph', 'sorting', 'searching', 'recursion', 'dynamic programming', 'greedy', 'backtracking'],
      'os': ['operating system', 'process', 'thread', 'deadlock', 'scheduling', 'memory management', 'paging', 'segmentation', 'virtual memory'],
      'sql': ['sql', 'query', 'select', 'join', 'database query', 'insert', 'update', 'delete'],
      'dbms': ['database', 'dbms', 'normalization', 'acid', 'transaction', 'indexing', 'relational', 'schema'],
      'system-design': ['system design', 'scalability', 'load balancing', 'caching', 'microservices', 'api design', 'distributed'],
      'networks': ['network', 'tcp', 'udp', 'ip', 'http', 'dns', 'routing', 'osi model', 'protocol'],
      'aptitude': ['aptitude', 'logical', 'reasoning', 'puzzle', 'probability', 'permutation', 'combination'],
      'ml': ['machine learning', 'regression', 'classification', 'clustering', 'supervised', 'unsupervised', 'model training'],
      'dl': ['deep learning', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer', 'backpropagation'],
      'gen-ai': ['generative ai', 'gpt', 'llm', 'large language model', 'prompt engineering', 'fine-tuning', 'rag']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => questionLower.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

  /**
   * Generate a response using Gemini AI
   */
  async generateResponse(question, conversationHistory = []) {
    try {
      // Build conversation context
      const chat = this.model.startChat({
        history: conversationHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      // Add system context to the first message
      const contextualQuestion = conversationHistory.length === 0
        ? `${this.getSystemPrompt()}\n\nUser Question: ${question}`
        : question;

      const result = await chat.sendMessage(contextualQuestion);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error.message);
      throw new Error('Failed to generate response from AI');
    }
  }

  /**
   * Process a user query with AI response and web resources
   */
  async processQuery(question, conversationHistory = [], includeResources = true) {
    try {
      // Detect topic from question
      const detectedTopic = this.detectTopic(question);

      // Generate AI response
      const aiResponse = await this.generateResponse(question, conversationHistory);

      // Search for web resources if requested
      let webResources = null;
      if (includeResources && detectedTopic !== 'general') {
        webResources = await this.searchWebResources(question, detectedTopic);
      }

      return {
        success: true,
        response: aiResponse,
        topic: detectedTopic,
        resources: webResources,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I encountered an error processing your question. Please try again.',
        topic: null,
        resources: null,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get suggested questions for a topic
   */
  getSuggestedQuestions(topic) {
    const suggestions = {
      'dsa': [
        'What is the difference between array and linked list?',
        'Explain time complexity of binary search',
        'How does merge sort work?',
        'What are the applications of hash tables?'
      ],
      'os': [
        'What is the difference between process and thread?',
        'Explain deadlock and its prevention',
        'How does virtual memory work?',
        'What is context switching?'
      ],
      'sql': [
        'What is the difference between INNER JOIN and LEFT JOIN?',
        'How do you optimize a slow SQL query?',
        'Explain indexing in databases',
        'What is a subquery?'
      ],
      'dbms': [
        'What is normalization and why is it important?',
        'Explain ACID properties',
        'What is the difference between clustered and non-clustered index?',
        'What are database transactions?'
      ],
      'system-design': [
        'How would you design a URL shortener?',
        'What is load balancing?',
        'Explain caching strategies',
        'What is CAP theorem?'
      ],
      'networks': [
        'What is the difference between TCP and UDP?',
        'Explain the OSI model',
        'How does DNS work?',
        'What is HTTP vs HTTPS?'
      ],
      'ml': [
        'What is overfitting and how to prevent it?',
        'Explain bias-variance tradeoff',
        'What is the difference between supervised and unsupervised learning?',
        'How does gradient descent work?'
      ],
      'dl': [
        'What is a neural network?',
        'Explain backpropagation',
        'What is the difference between CNN and RNN?',
        'What are activation functions?'
      ],
      'gen-ai': [
        'What is a Large Language Model?',
        'Explain prompt engineering',
        'What is fine-tuning vs RAG?',
        'How do transformers work?'
      ]
    };

    return suggestions[topic] || [
      'What topics do you cover?',
      'How can I prepare for technical interviews?',
      'What are some common interview questions?'
    ];
  }
}

module.exports = new ChatbotService();
