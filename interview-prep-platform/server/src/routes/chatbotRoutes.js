const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getUserConversations,
  deleteConversation,
  getSuggestions,
  clearAllConversations
} = require('../controllers/chatbotController');
const { protect, optional } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/query', optional, sendMessage);
router.get('/suggestions/:topic?', getSuggestions);

// Protected routes (authentication required)
router.get('/conversations', protect, getUserConversations);
router.get('/conversations/:id', protect, getConversation);
router.delete('/conversations/:id', protect, deleteConversation);
router.delete('/conversations', protect, clearAllConversations);

module.exports = router;
