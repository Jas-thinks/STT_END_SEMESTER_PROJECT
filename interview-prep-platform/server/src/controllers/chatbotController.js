const chatbotService = require('../services/chatbotService');
const { ChatConversation } = require('../models/ChatConversation');

/**
 * @desc    Send a message to the chatbot
 * @route   POST /api/chatbot/query
 * @access  Public (can be changed to Private if needed)
 */
exports.sendMessage = async (req, res) => {
  try {
    const { question, conversationId, includeResources = true } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    // Get conversation history if conversationId is provided
    let conversationHistory = [];
    let conversation = null;

    if (conversationId) {
      conversation = await ChatConversation.findById(conversationId);
      if (conversation) {
        // Convert to Gemini format
        conversationHistory = conversation.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
      }
    }

    // Process the query
    const result = await chatbotService.processQuery(
      question,
      conversationHistory,
      includeResources
    );

    // Save conversation if user is authenticated
    if (req.user) {
      if (!conversation) {
        conversation = new ChatConversation({
          userId: req.user._id,
          messages: []
        });
      }

      // Add user message
      conversation.messages.push({
        role: 'user',
        content: question,
        timestamp: new Date()
      });

      // Add bot response
      conversation.messages.push({
        role: 'assistant',
        content: result.response,
        topic: result.topic,
        resources: result.resources,
        timestamp: result.timestamp
      });

      conversation.lastActive = new Date();
      await conversation.save();

      return res.status(200).json({
        success: true,
        conversationId: conversation._id,
        ...result
      });
    }

    // For non-authenticated users, just return the response
    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your question',
      error: error.message
    });
  }
};

/**
 * @desc    Get conversation history
 * @route   GET /api/chatbot/conversations/:id
 * @access  Private
 */
exports.getConversation = async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user owns this conversation
    if (conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation',
      error: error.message
    });
  }
};

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/chatbot/conversations
 * @access  Private
 */
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find({ userId: req.user._id })
      .sort({ lastActive: -1 })
      .limit(20)
      .select('messages lastActive createdAt');

    // Add preview text for each conversation
    const conversationsWithPreview = conversations.map(conv => ({
      _id: conv._id,
      lastActive: conv.lastActive,
      createdAt: conv.createdAt,
      messageCount: conv.messages.length,
      preview: conv.messages[0]?.content.substring(0, 100) || 'New conversation'
    }));

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations: conversationsWithPreview
    });

  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/chatbot/conversations/:id
 * @access  Private
 */
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user owns this conversation
    if (conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this conversation'
      });
    }

    await conversation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
};

/**
 * @desc    Get suggested questions for a topic
 * @route   GET /api/chatbot/suggestions/:topic?
 * @access  Public
 */
exports.getSuggestions = async (req, res) => {
  try {
    const topic = req.params.topic || req.query.topic || 'general';
    const suggestions = chatbotService.getSuggestedQuestions(topic);

    res.status(200).json({
      success: true,
      topic,
      suggestions
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
};

/**
 * @desc    Clear conversation history
 * @route   DELETE /api/chatbot/conversations
 * @access  Private
 */
exports.clearAllConversations = async (req, res) => {
  try {
    await ChatConversation.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'All conversations cleared successfully'
    });

  } catch (error) {
    console.error('Clear conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear conversations',
      error: error.message
    });
  }
};
