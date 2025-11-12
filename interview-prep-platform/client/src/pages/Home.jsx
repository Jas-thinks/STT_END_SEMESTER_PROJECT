import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import QuizCard from '../components/quiz/QuizCard';
import { useQuiz } from '../context/QuizContext';

const Home = () => {
    const { quizzes } = useQuiz();

    return (
        <div>
            <Navbar />
            <div className="home-container">
                <h1>Welcome to the Interview Preparation Platform</h1>
                <p>Prepare for your interviews with our categorized questions.</p>
                <div className="quiz-cards">
                    {quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;