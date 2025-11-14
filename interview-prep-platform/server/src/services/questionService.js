const Question = require('../models/Question');
const fs = require('fs');
const path = require('path');

class QuestionService {
    async getAllQuestions() {
        return await Question.find({});
    }

    async getQuestionsByCategory(category) {
        return await Question.find({ category });
    }

    async addQuestion(questionData) {
        const question = new Question(questionData);
        return await question.save();
    }

    async updateQuestion(id, questionData) {
        return await Question.findByIdAndUpdate(id, questionData, { new: true });
    }

    async deleteQuestion(id) {
        return await Question.findByIdAndDelete(id);
    }

    async loadQuestionsFromFile(filePath) {
        const fullPath = path.join(__dirname, '../../data/questions', filePath);
        const data = fs.readFileSync(fullPath);
        const questions = JSON.parse(data);
        return await Question.insertMany(questions);
    }
}

module.exports = new QuestionService();