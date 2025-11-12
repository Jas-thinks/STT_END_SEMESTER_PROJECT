const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6; // Minimum length of 6 characters
};

const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric and underscores, 3 to 20 characters
    return re.test(String(username));
};

const validateQuizAnswer = (answer) => {
    return answer !== null && answer !== undefined; // Ensure answer is provided
};

const validateQuestionInput = (question) => {
    return question && question.trim().length > 0; // Ensure question is not empty
};

export {
    validateEmail,
    validatePassword,
    validateUsername,
    validateQuizAnswer,
    validateQuestionInput
};