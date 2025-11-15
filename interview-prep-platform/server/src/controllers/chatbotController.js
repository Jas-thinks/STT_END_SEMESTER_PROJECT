const chatbotService = require('../services/chatbotService');
const asyncHandler = require('express-async-handler');

// In-memory conversation storage (use Redis or MongoDB for production)
const conversations = new Map();

const MAX_HISTORY = 20; // Keep last 20 messages

/**
 * Get conversation history for a user
 */
const getChatHistory = (userId) => {
  if (!conversations.has(userId)) {
    conversations.set(userId, []);
  }
  return conversations.get(userId);
};

/**
 * Add message to conversation history
 */
const addToHistory = (userId, role, content) => {
  const history = getChatHistory(userId);
  
  history.push({
    role: role === 'user' ? 'user' : 'model',
    parts: [{ text: content }],
  });

  // Keep only last MAX_HISTORY messages
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
};

/**
 * @route   POST /api/chatbot/message
 * @desc    Send message to chatbot
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error('Message is required');
  }

  // Get conversation history (in Gemini format)
  const history = getChatHistory(userId);

  // Check if user is asking for resources
  const isResourceQuery = chatbotService.isResourceQuery(message);

  let botResponse;
  let resources = null;
  let summary = null;

  try {
    if (isResourceQuery) {
      // Search resources using Tavily first
      try {
        const searchResults = await chatbotService.searchResources(message);
        
        if (searchResults.success && searchResults.resources.length > 0) {
          resources = searchResults.resources;
          summary = searchResults.summary;

          // Get AI response acknowledging the resources
          const aiPrompt = `The user asked: "${message}". I've found ${resources.length} helpful resources for them including YouTube videos, articles, and tutorials. Please provide a brief, encouraging response (2-3 sentences) acknowledging their question and mentioning that resources are available below.`;
          
          const aiResponse = await chatbotService.chat(aiPrompt, history);
          botResponse = aiResponse.message;
        } else {
          // No resources found, give regular AI response
          const aiResponse = await chatbotService.chat(message, history);
          botResponse = aiResponse.message;
        }
      } catch (searchError) {
        console.error('Resource search failed:', searchError);
        // Fallback to regular AI response
        const aiResponse = await chatbotService.chat(message, history);
        botResponse = aiResponse.message;
      }
    } else {
      // Regular AI response for questions/explanations
      const aiResponse = await chatbotService.chat(message, history);
      botResponse = aiResponse.message;
    }

    // Add messages to history
    addToHistory(userId, 'user', message);
    addToHistory(userId, 'model', botResponse);

    // Get quick actions
    const quickActions = chatbotService.getQuickActions(message);

    res.json({
      success: true,
      data: {
        message: botResponse,
        resources,
        summary,
        quickActions,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500);
    throw new Error('Failed to process your message. Please try again.');
  }
});

/**
 * @route   GET /api/chatbot/history
 * @desc    Get chat history
 * @access  Private
 */
exports.getHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const history = getChatHistory(userId);

  // Convert to user-friendly format
  const messages = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.parts[0].text,
  }));

  res.json({
    success: true,
    data: { messages },
  });
});

/**
 * @route   DELETE /api/chatbot/history
 * @desc    Clear chat history
 * @access  Private
 */
exports.clearHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  conversations.delete(userId);

  res.json({
    success: true,
    message: 'Chat history cleared successfully',
  });
});

/**
 * @route   GET /api/chatbot/welcome
 * @desc    Get welcome message
 * @access  Private
 */
exports.getWelcome = asyncHandler(async (req, res) => {
  const userName = req.user.name;
  const welcomeMessage = chatbotService.getWelcomeMessage(userName);

  res.json({
    success: true,
    data: {
      message: welcomeMessage,
      quickActions: [
        { type: 'quiz', label: 'Start Practice', topic: 'DSA', icon: '🎯' },
        { type: 'navigate', label: 'View Progress', path: '/dashboard', icon: '📈' },
      ],
    },
  });
});

/**
 * @route   POST /api/chatbot/search
 * @desc    Search resources directly
 * @access  Private
 */
exports.searchResources = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    res.status(400);
    throw new Error('Search query is required');
  }

  try {
    const searchResults = await chatbotService.searchResources(query);

    res.json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500);
    throw new Error('Failed to search resources');
  }
});
