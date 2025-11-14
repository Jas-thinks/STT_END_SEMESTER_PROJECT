const Performance = require('../models/Performance');
const QuizAttempt = require('../models/QuizAttempt');
const asyncHandler = require('express-async-handler');

// @desc    Get user performance stats
// @route   GET /api/analytics/performance
// @access  Private
exports.getPerformance = asyncHandler(async (req, res) => {
    let performance = await Performance.findOne({ user: req.user.id });

    if (!performance) {
        performance = await Performance.create({ user: req.user.id });
    }

    res.json({
        success: true,
        data: performance
    });
});

// @desc    Get leaderboard
// @route   GET /api/analytics/leaderboard
// @access  Private
exports.getLeaderboard = asyncHandler(async (req, res) => {
    const { timeframe = 'all', subject, limit = 10 } = req.query;

    let dateFilter = {};
    if (timeframe === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = { completedAt: { $gte: weekAgo } };
    } else if (timeframe === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = { completedAt: { $gte: monthAgo } };
    }

    const matchQuery = { ...dateFilter };
    if (subject) matchQuery.subject = subject;

    const leaderboard = await QuizAttempt.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$user',
                totalQuizzes: { $sum: 1 },
                averageScore: { $avg: '$score' },
                averagePercentage: { $avg: '$percentage' },
                totalXP: { $sum: '$xpEarned' }
            }
        },
        { $sort: { totalXP: -1 } },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        { $unwind: '$userInfo' },
        {
            $project: {
                userId: '$_id',
                name: '$userInfo.name',
                level: '$userInfo.level',
                xp: '$userInfo.xp',
                totalQuizzes: 1,
                averageScore: 1,
                averagePercentage: 1,
                totalXP: 1
            }
        }
    ]);

    res.json({
        success: true,
        data: leaderboard
    });
});

// @desc    Get quiz statistics
// @route   GET /api/analytics/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
    const stats = await QuizAttempt.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: null,
                totalQuizzes: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                totalTime: { $sum: '$timeTaken' },
                bestScore: { $max: '$percentage' }
            }
        }
    ]);

    res.json({
        success: true,
        data: stats[0] || {}
    });
});

// @desc    Get category-wise performance
// @route   GET /api/analytics/category-performance
// @access  Private
exports.getCategoryPerformance = asyncHandler(async (req, res) => {
    const categoryPerformance = await QuizAttempt.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: '$subject',
                quizzesTaken: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                bestScore: { $max: '$percentage' },
                totalQuestions: { $sum: '$totalQuestions' },
                correctAnswers: { $sum: '$score' },
                totalTime: { $sum: '$timeTaken' }
            }
        },
        {
            $project: {
                category: '$_id',
                quizzesTaken: 1,
                averageScore: { $round: ['$averageScore', 2] },
                bestScore: { $round: ['$bestScore', 2] },
                accuracy: { 
                    $round: [
                        { $multiply: [
                            { $divide: ['$correctAnswers', '$totalQuestions'] }, 
                            100
                        ]}, 
                        2
                    ] 
                },
                totalTime: 1,
                _id: 0
            }
        },
        { $sort: { averageScore: -1 } }
    ]);

    res.json({
        success: true,
        data: categoryPerformance
    });
});

// @desc    Get weak areas (topics with < 60% accuracy)
// @route   GET /api/analytics/weak-areas
// @access  Private
exports.getWeakAreas = asyncHandler(async (req, res) => {
    const weakAreas = await QuizAttempt.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: '$subject',
                totalQuestions: { $sum: '$totalQuestions' },
                correctAnswers: { $sum: '$score' },
                attempts: { $sum: 1 }
            }
        },
        {
            $project: {
                topic: '$_id',
                accuracy: { 
                    $multiply: [
                        { $divide: ['$correctAnswers', '$totalQuestions'] }, 
                        100
                    ] 
                },
                attempts: 1,
                _id: 0
            }
        },
        { $match: { accuracy: { $lt: 60 } } },
        { $sort: { accuracy: 1 } }
    ]);

    res.json({
        success: true,
        data: weakAreas
    });
});

// @desc    Get time-based analytics
// @route   GET /api/analytics/time-analytics
// @access  Private
exports.getTimeAnalytics = asyncHandler(async (req, res) => {
    const { period = '7' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const timeAnalytics = await QuizAttempt.aggregate([
        { 
            $match: { 
                user: req.user._id,
                completedAt: { $gte: daysAgo }
            } 
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$completedAt" }
                },
                quizzes: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                totalTime: { $sum: '$timeTaken' }
            }
        },
        {
            $project: {
                date: '$_id',
                quizzes: 1,
                averageScore: { $round: ['$averageScore', 2] },
                totalTime: 1,
                _id: 0
            }
        },
        { $sort: { date: 1 } }
    ]);

    res.json({
        success: true,
        data: timeAnalytics
    });
});
