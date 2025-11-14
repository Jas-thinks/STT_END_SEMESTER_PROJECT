const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserAccount } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Route to get user profile
router.get('/profile', authenticate, getUserProfile);

// Route to update user profile
router.put('/profile', authenticate, updateUserProfile);

// Route to delete user account
router.delete('/account', authenticate, deleteUserAccount);

module.exports = router;