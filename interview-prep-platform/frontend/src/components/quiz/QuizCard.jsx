import React from 'react';

const QuizCard = ({ quiz }) => (
  <div className="quiz-card">
    <h3>{quiz.title}</h3>
    <p>{quiz.description}</p>
    {/* Add more quiz details and actions */}
  </div>
);

export default QuizCard;
