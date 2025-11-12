import React from 'react';
import { useQuiz } from '../../context/QuizContext';

const ResultSummary = () => {
    const { score, totalQuestions, resetQuiz } = useQuiz();

    const handleReset = () => {
        resetQuiz();
    };

    return (
        <div className="result-summary">
            <h2>Quiz Completed!</h2>
            <p>Your Score: {score} out of {totalQuestions}</p>
            <button onClick={handleReset} className="btn-reset">Try Again</button>
        </div>
    );
};

export default ResultSummary;