const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name='
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    streak: {
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActivityDate: Date
    },
    badges: [{
        name: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    bookmarkedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

// Update streak
UserSchema.methods.updateStreak = function() {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActivity = this.streak.lastActivityDate ? 
        new Date(this.streak.lastActivityDate).setHours(0, 0, 0, 0) : null;
    
    if (!lastActivity) {
        this.streak.currentStreak = 1;
    } else {
        const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            // Same day, no change
            return;
        } else if (daysDiff === 1) {
            // Consecutive day
            this.streak.currentStreak += 1;
        } else {
            // Streak broken
            this.streak.currentStreak = 1;
        }
    }
    
    if (this.streak.currentStreak > this.streak.longestStreak) {
        this.streak.longestStreak = this.streak.currentStreak;
    }
    
    this.streak.lastActivityDate = new Date();
};

// Add XP and level up
UserSchema.methods.addXP = function(points) {
    this.xp += points;
    
    // Level up calculation (100 XP per level)
    const newLevel = Math.floor(this.xp / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        return { leveledUp: true, newLevel };
    }
    
    return { leveledUp: false };
};

module.exports = mongoose.model('User', UserSchema);
