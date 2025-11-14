const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['DSA', 'OS', 'SQL', 'DBMS', 'System Design', 'Networks', 'Aptitude', 'ML', 'DL', 'GenAI']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard', 'mnc', 'interview']
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and Number
            required: true
        },
        userAnswer: Number,
        correctAnswer: Number,
        isCorrect: Boolean,
        timeTaken: Number // in seconds
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        default: 20
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // total time in seconds
        required: true
    },
    timeAllotted: {
        type: Number, // time allotted in seconds
        required: true
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    badgesEarned: [{
        name: String,
        description: String
    }],
    // Progress tracking fields
    inProgress: {
        type: Boolean,
        default: false
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    timeRemaining: {
        type: Number // time remaining in seconds
    },
    flaggedQuestions: [{
        type: Number // array of question indices
    }],
    tempAnswers: [{
        questionIndex: Number,
        userAnswer: Number,
        timeTaken: Number
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for analytics
QuizAttemptSchema.index({ user: 1, completedAt: -1 });
QuizAttemptSchema.index({ subject: 1, difficulty: 1 });

// Calculate XP based on performance
QuizAttemptSchema.methods.calculateXP = function() {
    let xp = 0;
    
    // Base XP for completion
    xp += 50;
    
    // XP per correct answer
    xp += this.score * 10;
    
    // Bonus for high percentage
    if (this.percentage >= 90) xp += 100;
    else if (this.percentage >= 75) xp += 50;
    else if (this.percentage >= 60) xp += 25;
    
    // Speed bonus (completed in less than 50% of time)
    if (this.timeTaken < (this.timeAllotted * 0.5)) {
        xp += 30;
    }
    
    // Difficulty multiplier
    const multipliers = { easy: 1, medium: 1.2, hard: 1.5, mnc: 1.8, interview: 2 };
    xp = Math.floor(xp * (multipliers[this.difficulty] || 1));
    
    this.xpEarned = xp;
    return xp;
};

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
