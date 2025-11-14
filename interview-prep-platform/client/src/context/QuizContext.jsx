import React, { createContext, useState, useEffect } from 'react';
import { fetchQuestions } from '../services/api';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions();
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, []);

    const nextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const submitAnswer = (isCorrect) => {
        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }
        nextQuestion();
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
    };

    return (
        <QuizContext.Provider
            value={{
                questions,
                loading,
                error,
                currentQuestionIndex,
                score,
                submitAnswer,
                resetQuiz,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};
export const useQuiz = () => {
    const context = React.useContext(QuizContext);
    if (!context) {
        throw new Error("useQuiz must be used within QuizProvider");
    }
    return context;
};
