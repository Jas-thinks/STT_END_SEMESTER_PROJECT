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
    getBookmarkedQuestions,
    saveProgress,
    getAttemptById,
    getQuizResults,
    getQuizReview
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', protect, getCategories);
router.get('/questions', protect, getQuestions);
router.get('/random', protect, getRandomQuiz);
router.post('/submit', protect, submitQuiz);
router.post('/save-progress', protect, saveProgress);
router.get('/attempt/:attemptId', protect, getAttemptById);
router.get('/results/:attemptId', protect, getQuizResults);
router.get('/review/:attemptId', protect, getQuizReview);
router.get('/history', protect, getQuizHistory);
router.get('/attempts', protect, getQuizAttempts);
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/:id', protect, getQuizAttempt);
router.post('/bookmark/:questionId', protect, bookmarkQuestion);

module.exports = router;
