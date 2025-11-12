const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Route to get user performance analytics
router.get('/performance/:userId', analyticsController.getUserPerformance);

// Route to get overall quiz statistics
router.get('/quiz-stats', analyticsController.getQuizStatistics);

// Route to get category-wise performance
router.get('/category-performance/:userId', analyticsController.getCategoryPerformance);

// Route to get question analytics
router.get('/question-analytics/:questionId', analyticsController.getQuestionAnalytics);

module.exports = router;