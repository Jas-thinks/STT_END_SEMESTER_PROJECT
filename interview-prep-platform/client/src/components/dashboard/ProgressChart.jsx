import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuiz } from '../../context/QuizContext';

const ProgressChart = () => {
    const { userProgress } = useQuiz();

    const data = {
        labels: userProgress.map(progress => progress.category),
        datasets: [
            {
                label: 'Progress',
                data: userProgress.map(progress => progress.completedQuestions),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Questions Completed',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Categories',
                },
            },
        },
    };

    return (
        <div>
            <h2>Your Progress</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ProgressChart;