import React, { useEffect, useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Loader } from '../components/common/Loader';
import { QuestionDisplay } from '../components/quiz/QuestionDisplay';
import { Timer } from '../components/quiz/Timer';
import { ResultSummary } from '../components/quiz/ResultSummary';

const Practice = () => {
    const { fetchQuestions, questions, loading, error, currentQuestionIndex, setCurrentQuestionIndex } = useQuiz();
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsQuizCompleted(true);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>Error loading questions: {error.message}</div>;

    return (
        <div className="practice-container">
            {isQuizCompleted ? (
                <ResultSummary questions={questions} />
            ) : (
                <>
                    <Timer />
                    <QuestionDisplay 
                        question={questions[currentQuestionIndex]} 
                        onNext={handleNextQuestion} 
                    />
                </>
            )}
        </div>
    );
};

export default Practice;