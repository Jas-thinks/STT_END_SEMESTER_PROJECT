import React from 'react';
import PropTypes from 'prop-types';
import './QuizCard.css';

const QuizCard = ({ quiz, onStart }) => {
    return (
        <div className="quiz-card">
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="quiz-description">{quiz.description}</p>
            <button className="start-quiz-button" onClick={() => onStart(quiz.id)}>
                Start Quiz
            </button>
        </div>
    );
};

QuizCard.propTypes = {
    quiz: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onStart: PropTypes.func.isRequired,
};

export default QuizCard;