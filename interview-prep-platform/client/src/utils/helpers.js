// This file contains helper functions used throughout the application.

export const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const calculateScore = (correctAnswers, totalQuestions) => {
    return ((correctAnswers / totalQuestions) * 100).toFixed(2);
};

export const getCategoryLabel = (category) => {
    const categoryLabels = {
        dsa: 'Data Structures & Algorithms',
        os: 'Operating Systems',
        sql: 'SQL',
        dbms: 'Database Management Systems',
        'system-design': 'System Design',
        networks: 'Networking',
        aptitude: 'Aptitude',
        ml: 'Machine Learning',
        dl: 'Deep Learning',
        'gen-ai': 'Generative AI',
    };
    return categoryLabels[category] || 'General';
};