import React, { useContext, useEffect, useState } from 'react';
import { QuizContext } from '../context/QuizContext';
import QuestionDisplay from '../components/quiz/QuestionDisplay';
import Timer from '../components/quiz/Timer';
import ResultSummary from '../components/quiz/ResultSummary';
import Loader from '../components/common/Loader';

const QuizPage = () => {
    const { fetchQuestions, questions, loading, currentQuestionIndex, setCurrentQuestionIndex, score } = useContext(QuizContext);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setIsQuizCompleted(true);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="quiz-page">
            {!isQuizCompleted ? (
                <>
                    <Timer />
                    <QuestionDisplay 
                        question={questions[currentQuestionIndex]} 
                        onNext={handleNextQuestion} 
                    />
                </>
            ) : (
                <ResultSummary score={score} totalQuestions={questions.length} />
            )}
        </div>
    );
};

export default QuizPage;