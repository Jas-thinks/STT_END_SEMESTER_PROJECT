const express = require('express');
const {
    getPerformance,
    getLeaderboard,
    getStats,
    getCategoryPerformance,
    getWeakAreas,
    getTimeAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/performance', protect, getPerformance);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getStats);
router.get('/category-performance', protect, getCategoryPerformance);
router.get('/weak-areas', protect, getWeakAreas);
router.get('/time-analytics', protect, getTimeAnalytics);

module.exports = router;
