const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    quizzesTaken: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizAttempt'
    }],
    performance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Performance'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;