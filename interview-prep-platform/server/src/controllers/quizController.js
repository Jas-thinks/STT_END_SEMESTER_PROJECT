const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const Performance = require('../models/Performance');
const questionService = require('../services/questionService');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories with metadata
// @route   GET /api/quiz/categories
// @access  Private
exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await questionService.getCategories();

    res.json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// @desc    Get random questions for quiz
// @route   GET /api/quiz/questions?subject=DSA&difficulty=medium&count=20
// @access  Private
exports.getQuestions = asyncHandler(async (req, res) => {
    const { subject, difficulty, count = 20 } = req.query;

    if (!subject || !difficulty) {
        res.status(400);
        throw new Error('Please provide subject and difficulty');
    }

    const questionData = await questionService.getQuestions(subject, difficulty, parseInt(count));

    res.json({
        success: true,
        data: questionData
    });
});

// @desc    Get random quiz questions
// @route   GET /api/quiz/random?count=20
// @access  Private
exports.getRandomQuiz = asyncHandler(async (req, res) => {
    const { count = 20 } = req.query;

    const questionData = await questionService.getRandomQuestions(parseInt(count));

    res.json({
        success: true,
        data: questionData
    });
});

// @desc    Submit quiz attempt
// @route   POST /api/quiz/submit
// @access  Private
exports.submitQuiz = asyncHandler(async (req, res) => {
    const { subject, difficulty, answers, timeTaken, timeAllotted, questions } = req.body;

    if (!subject || !difficulty || !answers || !Array.isArray(answers)) {
        res.status(400);
        throw new Error('Invalid quiz submission data');
    }

    // Calculate score from submitted answers
    // Since questions come from JSON files, we need the questions array sent from frontend
    let score = 0;
    const questionsData = answers.map((ans, index) => {
        const question = questions ? questions[index] : null;
        const isCorrect = question && question.correctAnswer === ans.userAnswer;
        
        if (isCorrect) score++;

        return {
            questionId: ans.questionId || index,
            userAnswer: ans.userAnswer,
            correctAnswer: question ? question.correctAnswer : ans.correctAnswer,
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

// @desc    Get all quiz attempts for user
// @route   GET /api/quiz/attempts
// @access  Private
exports.getQuizAttempts = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    
    const attempts = await QuizAttempt.find({ user: req.user.id })
        .sort({ completedAt: -1 })
        .limit(parseInt(limit))
        .select('-questions'); // Exclude detailed questions array for performance

    res.json({
        success: true,
        count: attempts.length,
        data: attempts
    });
});

// @desc    Save quiz progress
// @route   POST /api/quiz/save-progress
// @access  Private
exports.saveProgress = asyncHandler(async (req, res) => {
    const { attemptId, answers, currentQuestionIndex, timeRemaining, flaggedQuestions } = req.body;

    if (!attemptId) {
        res.status(400);
        throw new Error('Attempt ID is required');
    }

    // Find existing attempt or create new one
    let quizAttempt = await QuizAttempt.findById(attemptId);

    if (!quizAttempt) {
        res.status(404);
        throw new Error('Quiz attempt not found');
    }

    // Verify user owns this attempt
    if (quizAttempt.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this quiz attempt');
    }

    // Update progress
    quizAttempt.inProgress = true;
    quizAttempt.currentQuestionIndex = currentQuestionIndex || 0;
    quizAttempt.timeRemaining = timeRemaining;
    quizAttempt.flaggedQuestions = flaggedQuestions || [];
    
    // Update answers if provided
    if (answers && Array.isArray(answers)) {
        quizAttempt.tempAnswers = answers;
    }

    await quizAttempt.save();

    res.json({
        success: true,
        message: 'Progress saved successfully',
        data: quizAttempt
    });
});

// @desc    Get quiz attempt by ID
// @route   GET /api/quiz/attempt/:attemptId
// @access  Private
exports.getAttemptById = asyncHandler(async (req, res) => {
    const quizAttempt = await QuizAttempt.findById(req.params.attemptId);

    if (!quizAttempt) {
        res.status(404);
        throw new Error('Quiz attempt not found');
    }

    // Verify user owns this attempt
    if (quizAttempt.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view this quiz attempt');
    }

    res.json({
        success: true,
        data: quizAttempt
    });
});

// @desc    Get quiz results with detailed analysis
// @route   GET /api/quiz/results/:attemptId
// @access  Private
exports.getQuizResults = asyncHandler(async (req, res) => {
    const quizAttempt = await QuizAttempt.findById(req.params.attemptId);

    if (!quizAttempt) {
        res.status(404);
        throw new Error('Quiz attempt not found');
    }

    // Verify user owns this attempt
    if (quizAttempt.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view this quiz attempt');
    }

    // Calculate additional metrics
    const correctAnswers = quizAttempt.questions.filter(q => q.isCorrect).length;
    const incorrectAnswers = quizAttempt.questions.filter(q => !q.isCorrect && q.userAnswer !== null && q.userAnswer !== -1).length;
    const unattempted = quizAttempt.questions.filter(q => q.userAnswer === null || q.userAnswer === -1).length;

    // Calculate percentile (mock - would need all attempts for accurate percentile)
    const allAttempts = await QuizAttempt.find({
        subject: quizAttempt.subject,
        difficulty: quizAttempt.difficulty
    }).select('percentage');
    
    const lowerScores = allAttempts.filter(attempt => attempt.percentage < quizAttempt.percentage).length;
    const percentile = allAttempts.length > 0 ? Math.round((lowerScores / allAttempts.length) * 100) : 50;

    // Group questions by topic for performance breakdown
    const topicPerformance = {};
    quizAttempt.questions.forEach(q => {
        const topic = q.topic || 'General';
        if (!topicPerformance[topic]) {
            topicPerformance[topic] = { correct: 0, total: 0 };
        }
        topicPerformance[topic].total++;
        if (q.isCorrect) topicPerformance[topic].correct++;
    });

    // Calculate average time per question
    const avgTimePerQuestion = quizAttempt.timeTaken / quizAttempt.totalQuestions;

    res.json({
        success: true,
        data: {
            attempt: quizAttempt,
            summary: {
                totalScore: quizAttempt.score,
                percentage: quizAttempt.percentage,
                correctAnswers,
                incorrectAnswers,
                unattempted,
                timeTaken: quizAttempt.timeTaken,
                timeAllotted: quizAttempt.timeAllotted,
                percentile,
                avgTimePerQuestion: Math.round(avgTimePerQuestion)
            },
            performance: {
                byTopic: Object.entries(topicPerformance).map(([topic, stats]) => ({
                    topic,
                    correct: stats.correct,
                    total: stats.total,
                    accuracy: Math.round((stats.correct / stats.total) * 100)
                })),
                byDifficulty: {
                    difficulty: quizAttempt.difficulty,
                    accuracy: quizAttempt.percentage
                }
            }
        }
    });
});

// @desc    Get quiz review with all questions and answers
// @route   GET /api/quiz/review/:attemptId
// @access  Private
exports.getQuizReview = asyncHandler(async (req, res) => {
    const quizAttempt = await QuizAttempt.findById(req.params.attemptId);

    if (!quizAttempt) {
        res.status(404);
        throw new Error('Quiz attempt not found');
    }

    // Verify user owns this attempt
    if (quizAttempt.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view this quiz attempt');
    }

    // Return full attempt with all question details
    res.json({
        success: true,
        data: {
            subject: quizAttempt.subject,
            difficulty: quizAttempt.difficulty,
            score: quizAttempt.score,
            totalQuestions: quizAttempt.totalQuestions,
            percentage: quizAttempt.percentage,
            timeTaken: quizAttempt.timeTaken,
            questions: quizAttempt.questions.map(q => ({
                questionId: q.questionId,
                userAnswer: q.userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect: q.isCorrect,
                timeTaken: q.timeTaken
            }))
        }
    });
});
