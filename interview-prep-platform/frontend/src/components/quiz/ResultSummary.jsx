import React from 'react';

const ResultSummary = ({ result }) => (
  <div className="result-summary">
    <h3>Quiz Results</h3>
    <p>Score: {result.score}</p>
    {/* Add more result details */}
  </div>
);

export default ResultSummary;
