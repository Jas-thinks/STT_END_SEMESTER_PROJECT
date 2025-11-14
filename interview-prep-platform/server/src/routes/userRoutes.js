const express = require('express');
const { getUserProfile, updateUserProfile, updatePassword, deleteUserAccount } = require('../controllers/userController');
const { authenticate, protect } = require('../middleware/auth');

const router = express.Router();

// Use protect or authenticate - checking which one is available
const authMiddleware = protect || authenticate;

// Route to get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Route to update user profile
router.put('/profile', authMiddleware, updateUserProfile);

// Route to update password
router.put('/password', authMiddleware, updatePassword);

// Route to delete user account
router.delete('/account', authMiddleware, deleteUserAccount);

module.exports = router;