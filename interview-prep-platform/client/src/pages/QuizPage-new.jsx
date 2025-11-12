import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Timer from '../components/quiz/Timer';
import QuestionDisplay from '../components/quiz/QuestionDisplay';
import ResultSummary from '../components/quiz/ResultSummary';

const subjects = [
    { value: 'DSA', label: 'Data Structures & Algorithms' },
    { value: 'OS', label: 'Operating Systems' },
    { value: 'SQL', label: 'SQL' },
    { value: 'DBMS', label: 'Database Management Systems' },
    { value: 'System Design', label: 'System Design' },
    { value: 'Networks', label: 'Computer Networks' },
    { value: 'Aptitude', label: 'Aptitude' },
    { value: 'ML', label: 'Machine Learning' },
    { value: 'DL', label: 'Deep Learning' },
    { value: 'GenAI', label: 'Generative AI' }
];

const difficulties = [
    { value: 'easy', label: 'Easy (20 min) ⚡', time: 20 },
    { value: 'medium', label: 'Medium (30 min) 🔥', time: 30 },
    { value: 'hard', label: 'Hard (40 min) 💪', time: 40 },
    { value: 'mnc', label: 'MNC Interview 🎯', time: 40 },
    { value: 'interview', label: 'Interview 🚀', time: 40 }
];

const QuizPage = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isStarted, setIsStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(false);

    const timeLimit = difficulties.find(d => d.value === difficulty)?.time || 30;

    const startQuiz = async () => {
        if (!subject || !difficulty) {
            toast.error('Please select subject and difficulty');
            return;
        }

        setLoading(true);
        try {
            const response = await api.get('/quiz/questions', {
                params: { subject, difficulty, count: 20 }
            });

            setQuestions(response.data.data);
            setIsStarted(true);
            setTimeRemaining(timeLimit * 60);
            toast.success('Quiz started! Good luck! 🎯');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const submitQuiz = async () => {
        if (Object.keys(answers).length === 0) {
            toast.error('Please answer at least one question');
            return;
        }

        const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
            questionId,
            userAnswer,
            timeTaken: 0
        }));

        setLoading(true);
        try {
            const response = await api.post('/quiz/submit', {
                subject,
                difficulty,
                answers: formattedAnswers,
                timeTaken: (timeLimit * 60) - timeRemaining,
                timeAllotted: timeLimit * 60
            });

            setResults(response.data.data);
            setIsSubmitted(true);
            toast.success(`Quiz submitted! Score: ${response.data.data.quizAttempt.score}/20`);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit quiz');
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setSubject('');
        setDifficulty('');
        setQuestions([]);
        setAnswers({});
        setIsStarted(false);
        setIsSubmitted(false);
        setResults(null);
        setCurrentIndex(0);
    };

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeRemaining === 0 && isStarted && !isSubmitted) {
            submitQuiz();
        }
    }, [timeRemaining, isStarted, isSubmitted]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 's' && isStarted && !isSubmitted) {
                submitQuiz();
            }
            if (e.key === 'n' && isSubmitted) {
                resetQuiz();
            }
            if (['1', '2', '3', '4'].includes(e.key) && isStarted && !isSubmitted) {
                const currentQuestion = questions[currentIndex];
                if (currentQuestion) {
                    handleAnswer(currentQuestion._id, parseInt(e.key) - 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isStarted, isSubmitted, currentIndex, questions]);

    if (isSubmitted && results) {
        return (
            <ResultSummary
                results={results}
                questions={questions}
                answers={answers}
                onReset={resetQuiz}
            />
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        TheTrueTest Quiz
                    </h1>

                    {!isStarted ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Subject</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Choose a subject...</option>
                                    {subjects.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Choose difficulty...</option>
                                    {difficulties.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={startQuiz}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Start Quiz 🚀'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Timer
                                timeRemaining={timeRemaining}
                                setTimeRemaining={setTimeRemaining}
                                totalTime={timeLimit * 60}
                            />

                            <div className="flex justify-between items-center text-sm">
                                <span>Question {currentIndex + 1} of {questions.length}</span>
                                <span>Answered: {Object.keys(answers).length}/{questions.length}</span>
                            </div>

                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                />
                            </div>

                            <QuestionDisplay
                                questions={questions}
                                currentIndex={currentIndex}
                                answers={answers}
                                onAnswer={handleAnswer}
                                onNext={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
                                onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={submitQuiz}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Quiz (S)'}
                                </button>
                                <button
                                    onClick={resetQuiz}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    Reset (N)
                                </button>
                            </div>

                            <div className="text-center text-sm text-gray-400">
                                💡 Shortcuts: Press <kbd className="px-2 py-1 bg-gray-700 rounded">1-4</kbd> to select answers
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
