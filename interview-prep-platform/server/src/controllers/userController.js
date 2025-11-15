const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile with statistics
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get user statistics
    const totalQuizzes = await QuizAttempt.countDocuments({ user: req.user.id });
    
    const stats = await QuizAttempt.aggregate([
        { $match: { user: user._id } },
        {
            $group: {
                _id: null,
                avgScore: { $avg: '$percentage' },
                totalScore: { $sum: '$score' },
                totalQuestions: { $sum: '$totalQuestions' },
                totalTimeTaken: { $sum: '$timeTaken' }
            }
        }
    ]);

    // Get category-wise performance
    const categoryStats = await QuizAttempt.aggregate([
        { $match: { user: user._id } },
        {
            $group: {
                _id: '$subject',
                count: { $sum: 1 },
                avgScore: { $avg: '$percentage' },
                bestScore: { $max: '$percentage' }
            }
        },
        { $sort: { count: -1 } }
    ]);

    // Get recent achievements/badges
    const recentBadges = user.badges ? user.badges.slice(-5) : [];

    res.json({
        success: true,
        data: {
            user,
            statistics: {
                totalQuizzes,
                averageScore: stats[0]?.avgScore || 0,
                totalScore: stats[0]?.totalScore || 0,
                totalQuestions: stats[0]?.totalQuestions || 0,
                totalTimeTaken: stats[0]?.totalTimeTaken || 0,
                rank: user.rank || 'Beginner',
                level: user.level || 1,
                xp: user.xp || 0,
                streak: user.streak?.currentStreak || 0
            },
            categoryPerformance: categoryStats,
            recentBadges
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
        success: true,
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            level: updatedUser.level,
            xp: updatedUser.xp
        }
    });
});

// @desc    Get user quiz history
// @route   GET /api/users/history
// @access  Private
exports.getUserHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;

    // Build filter
    const filter = { user: req.user.id };
    
    if (category) {
        filter.subject = category;
    }

    if (startDate || endDate) {
        filter.completedAt = {};
        if (startDate) filter.completedAt.$gte = new Date(startDate);
        if (endDate) filter.completedAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const attempts = await QuizAttempt.find(filter)
        .sort({ completedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

    const total = await QuizAttempt.countDocuments(filter);

    res.json({
        success: true,
        data: {
            attempts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        }
    });
});

// @desc    Export user quiz history as CSV
// @route   GET /api/users/history/export
// @access  Private
exports.exportHistory = asyncHandler(async (req, res) => {
    const attempts = await QuizAttempt.find({ user: req.user.id })
        .sort({ completedAt: -1 })
        .lean();

    // Generate CSV
    const csvHeader = 'Date,Subject,Difficulty,Score,Total Questions,Percentage,Time Taken (min),XP Earned\n';
    const csvRows = attempts.map(attempt => {
        const date = new Date(attempt.completedAt).toLocaleDateString();
        const timeTaken = Math.round(attempt.timeTaken / 60);
        return `${date},${attempt.subject},${attempt.difficulty},${attempt.score},${attempt.totalQuestions},${attempt.percentage.toFixed(1)}%,${timeTaken},${attempt.xpEarned || 0}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=quiz-history.csv');
    res.send(csv);
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current and new password');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = asyncHandler(async (req, res) => {
    const { emailNotifications, theme, language } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update settings
    if (!user.settings) {
        user.settings = {};
    }

    if (emailNotifications !== undefined) {
        user.settings.emailNotifications = emailNotifications;
    }
    if (theme) {
        user.settings.theme = theme;
    }
    if (language) {
        user.settings.language = language;
    }

    await user.save();

    res.json({
        success: true,
        data: user.settings
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteUserAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        res.status(400);
        throw new Error('Please provide your password to confirm deletion');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
        res.status(400);
        throw new Error('Incorrect password');
    }

    // Delete all user's quiz attempts
    await QuizAttempt.deleteMany({ user: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({
        success: true,
        message: 'Account deleted successfully'
    });
});