const Analytics = require('../models/Performance');
const QuizAttempt = require('../models/QuizAttempt');

// Get user performance analytics
exports.getUserPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        const performanceData = await Analytics.find({ user: userId });

        if (!performanceData) {
            return res.status(404).json({ message: 'No performance data found' });
        }

        res.status(200).json(performanceData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get quiz attempt statistics
exports.getQuizAttemptStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const attempts = await QuizAttempt.find({ user: userId });

        const stats = {
            totalAttempts: attempts.length,
            correctAnswers: attempts.filter(attempt => attempt.isCorrect).length,
            averageScore: attempts.reduce((acc, attempt) => acc + attempt.score, 0) / attempts.length || 0,
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get overall performance analytics
exports.getOverallPerformance = async (req, res) => {
    try {
        const performanceData = await Analytics.aggregate([
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$score' },
                    totalUsers: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(performanceData[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};