const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const Performance = require('../models/Performance');
const asyncHandler = require('express-async-handler');

// @desc    Get random questions for quiz
// @route   GET /api/quiz/questions?subject=DSA&difficulty=medium&count=20
// @access  Private
exports.getQuestions = asyncHandler(async (req, res) => {
    const { subject, difficulty, count = 20 } = req.query;

    if (!subject || !difficulty) {
        res.status(400);
        throw new Error('Please provide subject and difficulty');
    }

    // Get random questions
    const questions = await Question.aggregate([
        { $match: { subject, difficulty, isActive: true } },
        { $sample: { size: parseInt(count) } },
        { $project: { 
            question: 1,
            options: 1,
            subject: 1,
            difficulty: 1,
            topic: 1
            // Don't send correctAnswer to frontend
        }}
    ]);

    res.json({
        success: true,
        count: questions.length,
        data: questions
    });
});

// @desc    Submit quiz attempt
// @route   POST /api/quiz/submit
// @access  Private
exports.submitQuiz = asyncHandler(async (req, res) => {
    const { subject, difficulty, answers, timeTaken, timeAllotted } = req.body;

    if (!subject || !difficulty || !answers || !Array.isArray(answers)) {
        res.status(400);
        throw new Error('Invalid quiz submission data');
    }

    // Get all questions with correct answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Calculate score
    let score = 0;
    const questionsData = answers.map(ans => {
        const question = questions.find(q => q._id.toString() === ans.questionId);
        const isCorrect = question && question.correctAnswer === ans.userAnswer;
        
        if (isCorrect) score++;

        // Update question statistics
        if (question) {
            question.statistics.totalAttempts += 1;
            if (isCorrect) question.statistics.correctAttempts += 1;
            question.save();
        }

        return {
            questionId: ans.questionId,
            userAnswer: ans.userAnswer,
            correctAnswer: question ? question.correctAnswer : -1,
            isCorrect,
            timeTaken: ans.timeTaken || 0
        };
    });

    const percentage = (score / answers.length) * 100;

    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
        user: req.user.id,
        subject,
        difficulty,
        questions: questionsData,
        score,
        totalQuestions: answers.length,
        percentage,
        timeTaken,
        timeAllotted
    });

    // Calculate and add XP
    const xpEarned = quizAttempt.calculateXP();
    const user = await User.findById(req.user.id);
    const levelUpResult = user.addXP(xpEarned);
    user.updateStreak();
    await user.save();

    // Update performance stats
    let performance = await Performance.findOne({ user: req.user.id });
    if (!performance) {
        performance = await Performance.create({ user: req.user.id });
    }
    await performance.updateStats(quizAttempt);

    res.status(201).json({
        success: true,
        data: {
            quizAttempt,
            xpEarned,
            levelUp: levelUpResult,
            user: {
                level: user.level,
                xp: user.xp,
                streak: user.streak
            }
        }
    });
});

// @desc    Get quiz history
// @route   GET /api/quiz/history
// @access  Private
exports.getQuizHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const quizzes = await QuizAttempt.find({ user: req.user.id })
        .sort({ completedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('questions.questionId', 'question options');

    const count = await QuizAttempt.countDocuments({ user: req.user.id });

    res.json({
        success: true,
        data: quizzes,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    });
});

// @desc    Get quiz attempt details
// @route   GET /api/quiz/:id
// @access  Private
exports.getQuizAttempt = asyncHandler(async (req, res) => {
    const quizAttempt = await QuizAttempt.findById(req.params.id)
        .populate('questions.questionId');

    if (!quizAttempt) {
        res.status(404);
        throw new Error('Quiz attempt not found');
    }

    // Make sure user owns this quiz attempt
    if (quizAttempt.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view this quiz attempt');
    }

    res.json({
        success: true,
        data: quizAttempt
    });
});

// @desc    Bookmark a question
// @route   POST /api/quiz/bookmark/:questionId
// @access  Private
exports.bookmarkQuestion = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const questionId = req.params.questionId;

    const index = user.bookmarkedQuestions.indexOf(questionId);
    
    if (index > -1) {
        // Remove bookmark
        user.bookmarkedQuestions.splice(index, 1);
    } else {
        // Add bookmark
        user.bookmarkedQuestions.push(questionId);
    }

    await user.save();

    res.json({
        success: true,
        data: user.bookmarkedQuestions
    });
});

// @desc    Get bookmarked questions
// @route   GET /api/quiz/bookmarks
// @access  Private
exports.getBookmarkedQuestions = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('bookmarkedQuestions');

    res.json({
        success: true,
        data: user.bookmarkedQuestions
    });
});
