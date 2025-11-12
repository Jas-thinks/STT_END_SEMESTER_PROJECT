import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL based on your server configuration

// Function to get all categorized interview questions
export const fetchQuestions = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/questions/${category}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching questions: ' + error.message);
    }
};

// Function to submit a quiz attempt
export const submitQuizAttempt = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/quiz/attempt`, data);
        return response.data;
    } catch (error) {
        throw new Error('Error submitting quiz attempt: ' + error.message);
    }
};

// Function to get user performance analytics
export const fetchUserPerformance = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/performance/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching user performance: ' + error.message);
    }
};

// Function to create a custom quiz
export const createCustomQuiz = async (quizData) => {
    try {
        const response = await axios.post(`${API_URL}/quiz/custom`, quizData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating custom quiz: ' + error.message);
    }
};