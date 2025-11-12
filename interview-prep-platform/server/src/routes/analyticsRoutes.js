const express = require('express');
const {
    getPerformance,
    getLeaderboard,
    getStats
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/performance', protect, getPerformance);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getStats);

module.exports = router;
