const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user quiz attempts
exports.getUserQuizAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.user.id }).populate('quiz');
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};