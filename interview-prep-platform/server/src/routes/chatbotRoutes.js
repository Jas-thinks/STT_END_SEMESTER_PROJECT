const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getHistory,
  clearHistory,
  getWelcome,
  searchResources,
} = require('../controllers/chatbotController');

// All routes are protected (require authentication)
router.use(protect);

// Chat routes
router.post('/message', sendMessage);
router.get('/history', getHistory);
router.delete('/history', clearHistory);
router.get('/welcome', getWelcome);
router.post('/search', searchResources);

module.exports = router;
