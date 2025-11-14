const express = require('express');
const {
    getCategories,
    getQuestions,
    getRandomQuiz,
    submitQuiz,
    getQuizHistory,
    getQuizAttempt,
    getQuizAttempts,
    bookmarkQuestion,
    getBookmarkedQuestions
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', protect, getCategories);
router.get('/questions', protect, getQuestions);
router.get('/random', protect, getRandomQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/attempts', protect, getQuizAttempts);
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/:id', protect, getQuizAttempt);
router.post('/bookmark/:questionId', protect, bookmarkQuestion);

module.exports = router;
