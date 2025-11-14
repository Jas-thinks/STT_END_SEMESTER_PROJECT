import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Export all functions from apiService for compatibility
export * from './apiService';

// Legacy functions for backward compatibility
export const fetchQuestions = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/questions/${category}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching questions: ' + error.message);
    }
};

export const submitQuizAttempt = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/quiz/attempt`, data);
        return response.data;
    } catch (error) {
        throw new Error('Error submitting quiz attempt: ' + error.message);
    }
};

export const fetchUserPerformance = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/performance/${userId || ''}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching user performance: ' + error.message);
    }
};

export const fetchPerformanceData = fetchUserPerformance;

export const createCustomQuiz = async (quizData) => {
    try {
        const response = await axios.post(`${API_URL}/quiz/custom`, quizData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating custom quiz: ' + error.message);
    }
};
