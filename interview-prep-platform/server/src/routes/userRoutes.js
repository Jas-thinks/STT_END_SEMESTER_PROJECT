const express = require('express');
const { 
    getUserProfile, 
    updateUserProfile, 
    updatePassword, 
    deleteUserAccount,
    getUserHistory,
    exportHistory,
    updateSettings
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Test route (no auth required)
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'User routes are working!' });
});

// Profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// History routes
router.get('/history', protect, getUserHistory);
router.get('/history/export', protect, exportHistory);

// Settings routes
router.put('/password', protect, updatePassword);
router.put('/settings', protect, updateSettings);

// Account deletion
router.delete('/account', protect, deleteUserAccount);

console.log('✅ User routes registered');

module.exports = router;