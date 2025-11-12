const express = require('express');
const {
    getQuestions,
    submitQuiz,
    getQuizHistory,
    getQuizAttempt,
    bookmarkQuestion,
    getBookmarkedQuestions
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/:id', protect, getQuizAttempt);
router.post('/bookmark/:questionId', protect, bookmarkQuestion);

module.exports = router;
