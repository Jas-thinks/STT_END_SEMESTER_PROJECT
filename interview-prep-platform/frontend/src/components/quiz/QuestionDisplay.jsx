import React from 'react';
import { Code2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import './QuestionDisplay.css';

const QuestionDisplay = ({ 
    question, 
    questionNumber, 
    totalQuestions, 
    selectedAnswer, 
    onAnswerSelect,
    showResult = false,
    correctAnswer = null
}) => {
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

    const handleOptionClick = (index) => {
        if (!showResult && onAnswerSelect) {
            onAnswerSelect(index);
        }
    };

    const getOptionClass = (index) => {
        let classes = 'question-option';
        
        if (showResult) {
            if (index === correctAnswer) {
                classes += ' option-correct';
            } else if (index === selectedAnswer && index !== correctAnswer) {
                classes += ' option-incorrect';
            }
        } else if (selectedAnswer === index) {
            classes += ' option-selected';
        }

        return classes;
    };

    return (
        <div className="question-display-container">
            {/* Question Header */}
            <div className="question-header">
                <div className="question-number">
                    Question {questionNumber} of {totalQuestions}
                </div>
                {question.topic && (
                    <div className="question-topic">
                        {question.topic}
                    </div>
                )}
            </div>

            {/* Question Content */}
            <div className="question-content">
                <div className="question-text">
                    {question.question}
                </div>

                {/* Code Snippet */}
                {question.code && (
                    <div className="question-code-container">
                        <div className="code-header">
                            <Code2 size={16} />
                            <span>Code</span>
                        </div>
                        <pre className="question-code">
                            <code>{question.code}</code>
                        </pre>
                    </div>
                )}

                {/* Image */}
                {question.image && (
                    <div className="question-image-container">
                        <div className="image-header">
                            <ImageIcon size={16} />
                            <span>Diagram</span>
                        </div>
                        <img 
                            src={question.image} 
                            alt="Question diagram" 
                            className="question-image"
                        />
                    </div>
                )}
            </div>

            {/* Answer Options */}
            <div className="question-options">
                <div className="options-label">Select your answer:</div>
                <div className="options-grid">
                    {question.options && question.options.map((option, index) => (
                        <div
                            key={index}
                            className={getOptionClass(index)}
                            onClick={() => handleOptionClick(index)}
                        >
                            <div className="option-label">
                                {optionLabels[index]}
                            </div>
                            <div className="option-content">
                                <div className="option-text">{option}</div>
                                {showResult && index === correctAnswer && (
                                    <CheckCircle2 
                                        size={20} 
                                        className="option-correct-icon" 
                                    />
                                )}
                            </div>
                            <div className="option-radio">
                                <div className={`radio-outer ${selectedAnswer === index ? 'radio-selected' : ''}`}>
                                    <div className="radio-inner"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Result Explanation (if in review mode) */}
            {showResult && question.explanation && (
                <div className="question-explanation">
                    <div className="explanation-header">Explanation</div>
                    <div className="explanation-content">
                        {question.explanation}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionDisplay;
