const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../utils/validators');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Route for user registration
router.post('/register', validateRegistration, registerUser);

// Route for user login
router.post('/login', validateLogin, loginUser);

// Route to get user profile
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;