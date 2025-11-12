const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp,
                token: user.getSignedJwtToken()
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            badges: user.badges,
            token: user.getSignedJwtToken()
        }
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
        success: true,
        data: user
    });
});

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        res.status(401);
        throw new Error('Password is incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({
        success: true,
        data: {
            token: user.getSignedJwtToken()
        }
    });
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: {}
    });
});
