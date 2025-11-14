import React, { createContext, useState } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizState, setQuizState] = useState({});
  // Add quiz logic here
  return (
    <QuizContext.Provider value={{ quizState, setQuizState }}>
      {children}
    </QuizContext.Provider>
  );
};
