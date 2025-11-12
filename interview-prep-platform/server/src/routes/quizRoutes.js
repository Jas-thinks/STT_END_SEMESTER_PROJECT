const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authMiddleware } = require('../middleware/auth');

// Route to get all quizzes
router.get('/', quizController.getAllQuizzes);

// Route to get a specific quiz by ID
router.get('/:id', quizController.getQuizById);

// Route to create a new quiz
router.post('/', authMiddleware, quizController.createQuiz);

// Route to update an existing quiz
router.put('/:id', authMiddleware, quizController.updateQuiz);

// Route to delete a quiz
router.delete('/:id', authMiddleware, quizController.deleteQuiz);

// Route to get questions for a specific quiz
router.get('/:id/questions', quizController.getQuestionsForQuiz);

// Route to submit a quiz attempt
router.post('/:id/attempt', authMiddleware, quizController.submitQuizAttempt);

// Route to get quiz performance analytics
router.get('/:id/performance', authMiddleware, quizController.getQuizPerformance);

module.exports = router;