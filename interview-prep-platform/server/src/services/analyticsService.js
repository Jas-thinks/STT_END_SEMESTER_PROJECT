const AnalyticsService = require('../models/Performance');

class AnalyticsService {
    async getUserPerformance(userId) {
        try {
            const performanceData = await AnalyticsService.find({ userId });
            return performanceData;
        } catch (error) {
            throw new Error('Error fetching user performance data');
        }
    }

    async recordQuizAttempt(userId, quizId, score) {
        try {
            const newAttempt = new AnalyticsService({
                userId,
                quizId,
                score,
                date: new Date(),
            });
            await newAttempt.save();
            return newAttempt;
        } catch (error) {
            throw new Error('Error recording quiz attempt');
        }
    }

    async getOverallPerformance() {
        try {
            const overallData = await AnalyticsService.aggregate([
                {
                    $group: {
                        _id: '$quizId',
                        averageScore: { $avg: '$score' },
                        totalAttempts: { $sum: 1 },
                    },
                },
            ]);
            return overallData;
        } catch (error) {
            throw new Error('Error fetching overall performance data');
        }
    }
}

module.exports = new AnalyticsService();