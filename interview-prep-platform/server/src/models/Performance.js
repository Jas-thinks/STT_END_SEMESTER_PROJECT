const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    overallStats: {
        totalQuizzes: { type: Number, default: 0 },
        totalQuestions: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        averagePercentage: { type: Number, default: 0 },
        totalTimeTaken: { type: Number, default: 0 }
    },
    subjectStats: {
        type: Map,
        of: {
            quizzesTaken: { type: Number, default: 0 },
            questionsAnswered: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
            bestScore: { type: Number, default: 0 },
            lastAttempt: Date
        },
        default: {}
    },
    difficultyStats: {
        easy: {
            quizzesTaken: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 }
        },
        medium: {
            quizzesTaken: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 }
        },
        hard: {
            quizzesTaken: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 }
        },
        mnc: {
            quizzesTaken: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 }
        },
        interview: {
            quizzesTaken: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 }
        }
    },
    weakTopics: [{
        topic: String,
        accuracy: Number,
        attemptsCount: Number
    }],
    strongTopics: [{
        topic: String,
        accuracy: Number,
        attemptsCount: Number
    }],
    recentActivity: [{
        date: Date,
        quizzesCompleted: Number,
        scoreAverage: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update performance stats after quiz attempt
PerformanceSchema.methods.updateStats = async function(quizAttempt) {
    // Update overall stats
    this.overallStats.totalQuizzes += 1;
    this.overallStats.totalQuestions += quizAttempt.totalQuestions;
    this.overallStats.correctAnswers += quizAttempt.score;
    this.overallStats.totalTimeTaken += quizAttempt.timeTaken;
    
    // Calculate new averages
    this.overallStats.averageScore = this.overallStats.correctAnswers / this.overallStats.totalQuizzes;
    this.overallStats.averagePercentage = (this.overallStats.correctAnswers / this.overallStats.totalQuestions) * 100;
    
    // Update subject stats
    const subjectKey = quizAttempt.subject;
    if (!this.subjectStats) this.subjectStats = new Map();
    
    const currentSubjectStats = this.subjectStats.get(subjectKey) || {
        quizzesTaken: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        averageScore: 0,
        bestScore: 0
    };
    
    currentSubjectStats.quizzesTaken += 1;
    currentSubjectStats.questionsAnswered += quizAttempt.totalQuestions;
    currentSubjectStats.correctAnswers += quizAttempt.score;
    currentSubjectStats.averageScore = currentSubjectStats.correctAnswers / currentSubjectStats.quizzesTaken;
    currentSubjectStats.bestScore = Math.max(currentSubjectStats.bestScore, quizAttempt.score);
    currentSubjectStats.lastAttempt = new Date();
    
    this.subjectStats.set(subjectKey, currentSubjectStats);
    
    // Update difficulty stats
    if (this.difficultyStats[quizAttempt.difficulty]) {
        const diffStats = this.difficultyStats[quizAttempt.difficulty];
        const oldAvg = diffStats.averageScore * diffStats.quizzesTaken;
        diffStats.quizzesTaken += 1;
        diffStats.averageScore = (oldAvg + quizAttempt.score) / diffStats.quizzesTaken;
    }
    
    this.lastUpdated = new Date();
    await this.save();
};

module.exports = mongoose.model('Performance', PerformanceSchema);
