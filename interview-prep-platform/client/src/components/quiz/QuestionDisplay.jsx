import React from 'react';
import PropTypes from 'prop-types';

const QuestionDisplay = ({ question, options, onSelect }) => {
  return (
    <div className="question-display">
      <h2 className="question-text">{question}</h2>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <button onClick={() => onSelect(option)} className="option-button">
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

QuestionDisplay.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default QuestionDisplay;