import { useState, useEffect, useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import api from '../services/api';

const useQuiz = () => {
    const { setQuestions, setLoading } = useContext(QuizContext);
    const [error, setError] = useState(null);

    const fetchQuestions = async (category) => {
        setLoading(true);
        try {
            const response = await api.get(`/questions/${category}`);
            setQuestions(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { fetchQuestions, error };
};

export default useQuiz;