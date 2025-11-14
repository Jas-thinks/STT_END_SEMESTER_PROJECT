const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
        trim: true
    },
    options: {
        type: [String],
        required: [true, 'Please provide options'],
        validate: {
            validator: function(v) {
                return v && v.length === 4;
            },
            message: 'Question must have exactly 4 options'
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, 'Please provide the correct answer index'],
        min: 0,
        max: 3
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        enum: ['DSA', 'OS', 'SQL', 'DBMS', 'System Design', 'Networks', 'Aptitude', 'ML', 'DL', 'GenAI']
    },
    difficulty: {
        type: String,
        required: [true, 'Please provide difficulty level'],
        enum: ['easy', 'medium', 'hard', 'mnc', 'interview']
    },
    topic: {
        type: String,
        trim: true
    },
    explanation: {
        type: String,
        trim: true
    },
    videoExplanation: String,
    relatedLinks: [String],
    tags: [String],
    statistics: {
        totalAttempts: { type: Number, default: 0 },
        correctAttempts: { type: Number, default: 0 },
        averageTime: { type: Number, default: 0 }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for fast queries
QuestionSchema.index({ subject: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });

// Get difficulty based on success rate
QuestionSchema.virtual('calculatedDifficulty').get(function() {
    if (this.statistics.totalAttempts === 0) return 'Unknown';
    
    const successRate = (this.statistics.correctAttempts / this.statistics.totalAttempts) * 100;
    
    if (successRate > 75) return 'Easy';
    if (successRate > 40) return 'Medium';
    return 'Hard';
});

module.exports = mongoose.model('Question', QuestionSchema);
