import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
    Trophy, 
    Target, 
    Clock, 
    Award, 
    TrendingUp,
    CheckCircle2,
    XCircle,
    Flag,
    Home,
    RotateCcw,
    Share2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    BarChart3,
    PieChart,
    Zap
} from 'lucide-react';
import QuestionDisplay from '../components/quiz/QuestionDisplay';
import api from '../services/api';
import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { attemptId } = useParams();
    
    // Get quiz data from navigation state or fetch from API
    const [quizData, setQuizData] = useState(location.state || null);
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, review, performance

    useEffect(() => {
        // If we have state data, use it
        if (location.state && location.state.quizAttempt) {
            const { quizAttempt, questions, answers } = location.state;
            setQuizData(location.state);
            
            // Calculate additional metrics
            calculateMetrics(quizAttempt, questions, answers);
        } 
        // Otherwise, fetch from API if we have attemptId
        else if (attemptId) {
            fetchResultData();
        } 
        // No data available, redirect to practice
        else {
            navigate('/practice');
        }
    }, [location.state, attemptId, navigate]);

    const fetchResultData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/quiz/results/${attemptId}`);
            setResultData(response.data.data);
        } catch (error) {
            console.error('Error fetching results:', error);
            navigate('/practice');
        } finally {
            setLoading(false);
        }
    };

    const calculateMetrics = (attempt, questions, answers) => {
        console.log('Calculate Metrics - Input:', { attempt, questions, answers });
        
        // Get score from attempt (already calculated by backend)
        const correctCount = attempt.quizAttempt?.score || attempt.score || 0;
        const totalQuestionsCount = attempt.quizAttempt?.totalQuestions || attempt.totalQuestions || questions.length;
        
        // Calculate incorrect and unattempted
        let incorrectCount = 0;
        let unattemptedCount = 0;
        
        answers.forEach((ans, idx) => {
            const userAnswer = ans !== null ? ans : -1;
            const correctAnswer = questions[idx]?.correct_answer;
            
            if (userAnswer === null || userAnswer === -1) {
                unattemptedCount++;
            } else if (userAnswer !== correctAnswer) {
                incorrectCount++;
            }
        });

        // Topic-wise performance
        const topicStats = {};
        questions.forEach((q, idx) => {
            const topic = q.topic || 'General';
            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0 };
            }
            topicStats[topic].total++;
            if (answers[idx] === q.correct_answer) {
                topicStats[topic].correct++;
            }
        });

        const attemptData = attempt.quizAttempt || attempt;

        const calculatedData = {
            attempt: attemptData,
            summary: {
                totalScore: correctCount,
                percentage: attemptData.percentage || 0,
                correctAnswers: correctCount,
                incorrectAnswers: incorrectCount,
                unattempted: unattemptedCount,
                timeTaken: attemptData.timeTaken || 0,
                timeAllotted: attemptData.timeAllotted || 0,
                percentile: 75, // Mock value - can be fetched from backend
                avgTimePerQuestion: Math.round((attemptData.timeTaken || 0) / totalQuestionsCount)
            },
            performance: {
                byTopic: Object.entries(topicStats).map(([topic, stats]) => ({
                    topic,
                    correct: stats.correct,
                    total: stats.total,
                    accuracy: Math.round((stats.correct / stats.total) * 100)
                })),
                byDifficulty: {
                    difficulty: attemptData.difficulty,
                    accuracy: attemptData.percentage || 0
                }
            },
            questions,
            answers
        };

        console.log('Calculate Metrics - Output:', calculatedData);
        setResultData(calculatedData);
    };

    if (loading) {
        return (
            <div className="result-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ color: 'white', fontSize: '18px' }}>Loading results...</div>
            </div>
        );
    }

    if (!resultData) {
        return null;
    }

    const { attempt, summary, performance, questions, answers } = resultData;
    const { 
        score, 
        totalQuestions, 
        percentage, 
        timeTaken,
        timeAllotted,
        xpEarned,
        subject,
        difficulty,
        user
    } = attempt.quizAttempt || attempt;

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Get performance message
    const getPerformanceMessage = () => {
        if (percentage >= 90) return { message: 'Outstanding! 🎉', color: '#10b981', emoji: '🌟' };
        if (percentage >= 75) return { message: 'Excellent Work! 👏', color: '#10b981', emoji: '✨' };
        if (percentage >= 60) return { message: 'Good Job! 👍', color: '#f59e0b', emoji: '💪' };
        if (percentage >= 40) return { message: 'Keep Practicing! 📚', color: '#f59e0b', emoji: '📈' };
        return { message: 'Need More Practice 💡', color: '#ef4444', emoji: '🎯' };
    };

    const performanceMsg = getPerformanceMessage();

    // Get grade
    const getGrade = () => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    // Toggle question expansion
    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    // Handle retake
    const handleRetake = () => {
        navigate('/practice');
    };

    // Handle home
    const handleHome = () => {
        navigate('/dashboard');
    };

    // Handle practice weak areas
    const handlePracticeWeakAreas = () => {
        // Find weakest topic
        if (performance && performance.byTopic) {
            const weakestTopic = performance.byTopic.reduce((min, topic) => 
                topic.accuracy < min.accuracy ? topic : min
            , performance.byTopic[0]);
            
            navigate('/practice', { state: { suggestedTopic: weakestTopic.topic } });
        } else {
            navigate('/practice');
        }
    };

    // Calculate stats
    const correctAnswers = summary?.correctAnswers || score;
    const incorrectAnswers = summary?.incorrectAnswers || (totalQuestions - score);
    const unattempted = summary?.unattempted || 0;
    const accuracy = percentage;

    return (
        <div className="result-page">
            {/* Share Modal */}
            {showShareModal && (
                <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
                    <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Share Your Achievement</h3>
                        <p>I scored {percentage.toFixed(1)}% on {subject} Quiz!</p>
                        <div className="share-buttons">
                            <button className="share-btn twitter">Share on Twitter</button>
                            <button className="share-btn linkedin">Share on LinkedIn</button>
                            <button className="share-btn copy">Copy Link</button>
                        </div>
                        <button onClick={() => setShowShareModal(false)} className="share-close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="result-container">
                {/* Header */}
                <div className="result-header">
                    <div className="result-badge" style={{ borderColor: performanceMsg.color }}>
                        <Trophy size={48} style={{ color: performanceMsg.color }} />
                    </div>
                    <h1 className="result-title">{performanceMsg.message}</h1>
                    <div className="result-grade" style={{ background: performanceMsg.color }}>
                        {getGrade()}
                    </div>
                    <div className="result-meta">
                        <span className={`difficulty-badge difficulty-${difficulty}`}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                        <span className="subject-badge">{subject}</span>
                    </div>
                </div>

                {/* Score Card */}
                <div className="score-card">
                    <div className="score-circle" style={{ 
                        background: `conic-gradient(${performanceMsg.color} ${percentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)` 
                    }}>
                        <div className="score-inner">
                            <div className="score-value">{percentage.toFixed(1)}%</div>
                            <div className="score-label">Score</div>
                        </div>
                    </div>
                    <div className="score-details">
                        <div className="score-stat">
                            <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                            <div>
                                <div className="stat-value">{correctAnswers}</div>
                                <div className="stat-label">Correct</div>
                            </div>
                        </div>
                        <div className="score-stat">
                            <XCircle size={24} style={{ color: '#ef4444' }} />
                            <div>
                                <div className="stat-value">{incorrectAnswers}</div>
                                <div className="stat-label">Incorrect</div>
                            </div>
                        </div>
                        {unattempted > 0 && (
                            <div className="score-stat">
                                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                                <div>
                                    <div className="stat-value">{unattempted}</div>
                                    <div className="stat-label">Unattempted</div>
                                </div>
                            </div>
                        )}
                        <div className="score-stat">
                            <Target size={24} style={{ color: '#a855f7' }} />
                            <div>
                                <div className="stat-value">{totalQuestions}</div>
                                <div className="stat-label">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <Clock className="stat-icon" />
                        <div className="stat-content">
                            <div className="stat-title">Time Taken</div>
                            <div className="stat-data">{formatTime(timeTaken)}</div>
                            <div className="stat-subtitle">of {formatTime(timeAllotted)}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Award className="stat-icon" />
                        <div className="stat-content">
                            <div className="stat-title">XP Earned</div>
                            <div className="stat-data">+{xpEarned}</div>
                            {user && <div className="stat-subtitle">Level {user.level}</div>}
                        </div>
                    </div>
                    <div className="stat-card">
                        <TrendingUp className="stat-icon" />
                        <div className="stat-content">
                            <div className="stat-title">Percentile</div>
                            <div className="stat-data">{summary?.percentile || 75}th</div>
                            <div className="stat-subtitle">All users</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Zap className="stat-icon" />
                        <div className="stat-content">
                            <div className="stat-title">Avg Time/Q</div>
                            <div className="stat-data">{summary?.avgTimePerQuestion || Math.round(timeTaken/totalQuestions)}s</div>
                            <div className="stat-subtitle">Per question</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="result-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <BarChart3 size={18} />
                        Overview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        <PieChart size={18} />
                        Performance
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
                        onClick={() => setActiveTab('review')}
                    >
                        <Flag size={18} />
                        Review Questions
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <div className="overview-section">
                            <h3>Quick Summary</h3>
                            <div className="summary-cards">
                                <div className="summary-card">
                                    <div className="summary-icon" style={{ background: '#10b981' }}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="summary-info">
                                        <div className="summary-label">Accuracy</div>
                                        <div className="summary-value">{accuracy.toFixed(1)}%</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon" style={{ background: '#3b82f6' }}>
                                        <Clock size={24} />
                                    </div>
                                    <div className="summary-info">
                                        <div className="summary-label">Speed</div>
                                        <div className="summary-value">{timeTaken < timeAllotted * 0.75 ? 'Fast' : 'Normal'}</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon" style={{ background: '#a855f7' }}>
                                        <Award size={24} />
                                    </div>
                                    <div className="summary-info">
                                        <div className="summary-label">Performance</div>
                                        <div className="summary-value">{getGrade()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && performance && (
                    <div className="tab-content">
                        <div className="performance-section">
                            <h3>Performance Breakdown</h3>
                            
                            {/* Topic-wise Performance */}
                            {performance.byTopic && performance.byTopic.length > 0 && (
                                <div className="performance-card">
                                    <h4>Score by Topic</h4>
                                    <div className="topic-list">
                                        {performance.byTopic.map((topic, idx) => (
                                            <div key={idx} className="topic-item">
                                                <div className="topic-header">
                                                    <span className="topic-name">{topic.topic}</span>
                                                    <span className="topic-score">{topic.correct}/{topic.total}</span>
                                                </div>
                                                <div className="topic-bar">
                                                    <div 
                                                        className="topic-progress" 
                                                        style={{ 
                                                            width: `${topic.accuracy}%`,
                                                            background: topic.accuracy >= 70 ? '#10b981' : topic.accuracy >= 50 ? '#f59e0b' : '#ef4444'
                                                        }}
                                                    >
                                                        <span className="topic-percentage">{topic.accuracy}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Difficulty Performance */}
                            <div className="performance-card">
                                <h4>Accuracy by Difficulty</h4>
                                <div className="difficulty-stats">
                                    <div className="difficulty-item">
                                        <span className="difficulty-label">{difficulty.toUpperCase()}</span>
                                        <div className="difficulty-bar">
                                            <div 
                                                className="difficulty-progress"
                                                style={{ width: `${accuracy}%` }}
                                            />
                                        </div>
                                        <span className="difficulty-value">{accuracy.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Time Analysis */}
                            <div className="performance-card">
                                <h4>Time Management</h4>
                                <div className="time-analysis">
                                    <div className="time-stat">
                                        <span>Total Time</span>
                                        <strong>{formatTime(timeTaken)}</strong>
                                    </div>
                                    <div className="time-stat">
                                        <span>Time per Question</span>
                                        <strong>{summary?.avgTimePerQuestion || Math.round(timeTaken/totalQuestions)}s</strong>
                                    </div>
                                    <div className="time-stat">
                                        <span>Time Efficiency</span>
                                        <strong>{Math.round((timeTaken / timeAllotted) * 100)}%</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'review' && questions && (
                    <div className="tab-content">
                        <div className="question-review-section">
                            <div className="review-header">
                                <h3>Question Review</h3>
                                <div className="review-stats">
                                    <div className="review-stat correct">
                                        <CheckCircle2 size={16} />
                                        {correctAnswers} Correct
                                    </div>
                                    <div className="review-stat incorrect">
                                        <XCircle size={16} />
                                        {incorrectAnswers} Incorrect
                                    </div>
                                    {unattempted > 0 && (
                                        <div className="review-stat unattempted">
                                            <AlertCircle size={16} />
                                            {unattempted} Unattempted
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="questions-list">
                                {questions.map((question, index) => {
                                    const userAns = answers[index];
                                    const isCorrect = userAns === question.correct_answer;
                                    const isUnattempted = userAns === null || userAns === -1;
                                    const isExpanded = expandedQuestion === index;

                                    return (
                                        <div 
                                            key={index} 
                                            className={`question-review-item ${isCorrect ? 'correct' : isUnattempted ? 'unattempted' : 'incorrect'}`}
                                        >
                                            <div 
                                                className="question-review-header"
                                                onClick={() => toggleQuestion(index)}
                                            >
                                                <div className="question-review-info">
                                                    {isCorrect ? (
                                                        <CheckCircle2 size={20} className="question-status-icon correct-icon" />
                                                    ) : isUnattempted ? (
                                                        <AlertCircle size={20} className="question-status-icon unattempted-icon" />
                                                    ) : (
                                                        <XCircle size={20} className="question-status-icon incorrect-icon" />
                                                    )}
                                                    <span className="question-review-number">Question {index + 1}</span>
                                                    {question.topic && <span className="question-review-topic">{question.topic}</span>}
                                                    {difficulty && (
                                                        <span className={`question-difficulty difficulty-${difficulty}`}>
                                                            {difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="expand-btn">
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className="question-review-content">
                                                    <QuestionDisplay
                                                        question={question}
                                                        questionNumber={index + 1}
                                                        totalQuestions={totalQuestions}
                                                        selectedAnswer={userAns}
                                                        showResult={true}
                                                        correctAnswer={question.correct_answer}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="result-actions">
                    <button onClick={handleHome} className="action-btn btn-home">
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button onClick={handleRetake} className="action-btn btn-retake">
                        <RotateCcw size={20} />
                        Practice Again
                    </button>
                    {performance && performance.byTopic && (
                        <button onClick={handlePracticeWeakAreas} className="action-btn btn-weak">
                            <Target size={20} />
                            Practice Weak Areas
                        </button>
                    )}
                    <button onClick={() => setShowShareModal(true)} className="action-btn btn-share">
                        <Share2 size={20} />
                        Share Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
