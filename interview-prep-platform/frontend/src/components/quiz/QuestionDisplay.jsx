import React from 'react';

const QuestionDisplay = ({ question }) => (
  <div className="question-display">
    <h4>{question.text}</h4>
    {/* Render options and handle selection */}
  </div>
);

export default QuestionDisplay;
