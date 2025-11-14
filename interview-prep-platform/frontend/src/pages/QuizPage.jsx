import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    ChevronRight, 
    Flag, 
    Grid3x3, 
    Send,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import Timer from '../components/quiz/Timer';
import QuestionDisplay from '../components/quiz/QuestionDisplay';
import api from '../services/api';
import './QuizPage.css';

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get quiz data from navigation state
    const { questions, subject, difficulty, timeLimit } = location.state || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(questions?.length || 20).fill(null));
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);
    const [showPalette, setShowPalette] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timeLimit || 1200);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime] = useState(Date.now());

    // Redirect if no quiz data
    useEffect(() => {
        if (!questions || !subject || !difficulty) {
            navigate('/practice');
        }
    }, [questions, subject, difficulty, navigate]);

    if (!questions || !subject || !difficulty) {
        return null;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Handle answer selection
    const handleAnswerSelect = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    // Navigate to next question
    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Navigate to previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Toggle flag on question
    const handleFlag = () => {
        if (flaggedQuestions.includes(currentQuestionIndex)) {
            setFlaggedQuestions(flaggedQuestions.filter(i => i !== currentQuestionIndex));
        } else {
            setFlaggedQuestions([...flaggedQuestions, currentQuestionIndex]);
        }
    };

    // Jump to specific question
    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setShowPalette(false);
    };

    // Calculate progress
    const getAnsweredCount = () => {
        return answers.filter(a => a !== null).length;
    };

    const getProgressPercentage = () => {
        return (getAnsweredCount() / totalQuestions) * 100;
    };

    // Handle time end
    const handleTimeEnd = () => {
        handleSubmitQuiz(true); // Auto-submit
    };

    // Handle time update
    const handleTimeUpdate = (time) => {
        setTimeRemaining(time);
    };

    // Submit quiz
    const handleSubmitQuiz = async (autoSubmit = false) => {
        if (!autoSubmit) {
            setShowSubmitConfirm(true);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            
            // Prepare answers data with question details
            const answersData = questions.map((q, index) => ({
                questionId: q.id || index,
                userAnswer: answers[index] !== null ? answers[index] : -1,
                correctAnswer: q.correct_answer,
                timeTaken: Math.floor(timeTaken / totalQuestions) // Approximate time per question
            }));

            const response = await api.post('/quiz/submit', {
                subject,
                difficulty,
                answers: answersData,
                questions: questions, // Send questions for validation
                timeTaken,
                timeAllotted: timeLimit
            });

            // Navigate to results page with quiz attempt data
            navigate('/result', { 
                state: { 
                    quizAttempt: response.data.data,
                    questions,
                    answers
                } 
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Confirm submit
    const confirmSubmit = () => {
        setShowSubmitConfirm(false);
        handleSubmitQuiz(true);
    };

    // Get question status
    const getQuestionStatus = (index) => {
        if (answers[index] !== null) return 'answered';
        if (flaggedQuestions.includes(index)) return 'flagged';
        return 'unanswered';
    };

    return (
        <div className="quiz-page">
            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="submit-confirm-overlay">
                    <div className="submit-confirm-modal">
                        <div className="submit-confirm-icon">
                            <AlertCircle size={48} />
                        </div>
                        <h3>Submit Quiz?</h3>
                        <div className="submit-confirm-stats">
                            <div className="stat-item">
                                <CheckCircle2 size={20} />
                                <span>{getAnsweredCount()} answered</span>
                            </div>
                            <div className="stat-item">
                                <X size={20} />
                                <span>{totalQuestions - getAnsweredCount()} unanswered</span>
                            </div>
                            {flaggedQuestions.length > 0 && (
                                <div className="stat-item">
                                    <Flag size={20} />
                                    <span>{flaggedQuestions.length} flagged</span>
                                </div>
                            )}
                        </div>
                        <p>Are you sure you want to submit? You cannot change answers after submission.</p>
                        <div className="submit-confirm-actions">
                            <button 
                                onClick={() => setShowSubmitConfirm(false)}
                                className="btn-cancel"
                            >
                                Review Answers
                            </button>
                            <button 
                                onClick={confirmSubmit}
                                className="btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Palette Modal */}
            {showPalette && (
                <div className="palette-overlay" onClick={() => setShowPalette(false)}>
                    <div className="palette-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="palette-header">
                            <h3>Question Palette</h3>
                            <button onClick={() => setShowPalette(false)} className="palette-close">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="palette-legend">
                            <div className="legend-item">
                                <div className="legend-box answered"></div>
                                <span>Answered</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-box flagged"></div>
                                <span>Flagged</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-box unanswered"></div>
                                <span>Not Answered</span>
                            </div>
                        </div>
                        <div className="palette-grid">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`palette-item ${getQuestionStatus(index)} ${currentQuestionIndex === index ? 'current' : ''}`}
                                    onClick={() => jumpToQuestion(index)}
                                >
                                    {index + 1}
                                    {flaggedQuestions.includes(index) && (
                                        <Flag size={12} className="palette-flag" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Quiz Interface */}
            <div className="quiz-container">
                {/* Header */}
                <div className="quiz-header">
                    <div className="quiz-info">
                        <h2>{subject} Quiz</h2>
                        <div className="quiz-meta">
                            <span className="difficulty-badge difficulty-{difficulty}">
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </span>
                            <span className="question-count">
                                {totalQuestions} Questions
                            </span>
                        </div>
                    </div>
                    <div className="quiz-timer">
                        <Timer 
                            initialTime={timeLimit}
                            onTimeEnd={handleTimeEnd}
                            onTimeUpdate={handleTimeUpdate}
                            autoSubmit={true}
                        />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="quiz-progress-container">
                    <div className="progress-info">
                        <span>{getAnsweredCount()} / {totalQuestions} Answered</span>
                        <span>{Math.round(getProgressPercentage())}% Complete</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${getProgressPercentage()}%` }}
                        />
                    </div>
                </div>

                {/* Question Display */}
                <div className="quiz-content">
                    <QuestionDisplay
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        selectedAnswer={answers[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                    />
                </div>

                {/* Navigation */}
                <div className="quiz-navigation">
                    <div className="nav-left">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="nav-btn nav-btn-prev"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>
                        <button
                            onClick={handleFlag}
                            className={`nav-btn nav-btn-flag ${flaggedQuestions.includes(currentQuestionIndex) ? 'flagged' : ''}`}
                        >
                            <Flag size={20} />
                            {flaggedQuestions.includes(currentQuestionIndex) ? 'Unflag' : 'Flag'}
                        </button>
                    </div>

                    <div className="nav-center">
                        <button
                            onClick={() => setShowPalette(true)}
                            className="nav-btn nav-btn-palette"
                        >
                            <Grid3x3 size={20} />
                            Question Palette
                        </button>
                    </div>

                    <div className="nav-right">
                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <button
                                onClick={handleNext}
                                className="nav-btn nav-btn-next"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmitQuiz(false)}
                                className="nav-btn nav-btn-submit"
                                disabled={isSubmitting}
                            >
                                <Send size={20} />
                                Submit Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
