const Quiz = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz', error });
    }
};

// Create a new quiz attempt
exports.createQuizAttempt = async (req, res) => {
    const { userId, quizId, answers } = req.body;
    try {
        const newAttempt = new QuizAttempt({ userId, quizId, answers });
        await newAttempt.save();
        res.status(201).json(newAttempt);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz attempt', error });
    }
};

// Get quiz attempts by user
exports.getQuizAttemptsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const attempts = await QuizAttempt.find({ userId });
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz attempts', error });
    }
};