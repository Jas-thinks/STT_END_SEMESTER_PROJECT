const Question = require('../models/Question');
const fs = require('fs').promises;
const path = require('path');

// Map category names to file prefixes
const categoryMap = {
  'DSA': '1Dsa',
  'OS': '2Os',
  'SQL': '3Sql',
  'DBMS': '4Dbms',
  'System Design': '5System_design',
  'Networks': '6Networks',
  'Aptitude': '7Aptitude',
  'ML': '8ML',
  'DL': '9DL',
  'Gen-AI': '10Gen_Ai'
};

// Map difficulty to file suffixes
const difficultyMap = {
  'easy': 'easy',
  'medium': 'medium',
  'hard': 'hard',
  'mnc': 'mnc',
  'interview': 'interview'
};

const QUESTIONS_DIR = path.join(__dirname, '../../../Questions');

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
        const data = await fs.readFile(fullPath);
        const questions = JSON.parse(data);
        return await Question.insertMany(questions);
    }

    /**
     * Get all available categories with metadata
     */
    async getCategories() {
        const categories = [];
        
        for (const [categoryName, filePrefix] of Object.entries(categoryMap)) {
            try {
                let totalQuestions = 0;
                const difficulties = ['easy', 'medium', 'hard'];
                
                // Special cases for ML, DL, Gen-AI which have 'interview' instead of 'mnc'
                if (['ML', 'DL', 'Gen-AI'].includes(categoryName)) {
                    difficulties.push('interview');
                } else {
                    difficulties.push('mnc');
                }

                for (const diff of difficulties) {
                    const fileName = `${filePrefix}_${diff}.json`;
                    const filePath = path.join(QUESTIONS_DIR, fileName);
                    
                    try {
                        const fileContent = await fs.readFile(filePath, 'utf-8');
                        const data = JSON.parse(fileContent);
                        totalQuestions += data.total_questions || data.questions?.length || 0;
                    } catch (err) {
                        continue;
                    }
                }

                categories.push({
                    name: categoryName,
                    displayName: categoryName,
                    totalQuestions,
                    icon: this.getCategoryIcon(categoryName)
                });
            } catch (error) {
                console.error(`Error processing category ${categoryName}:`, error);
            }
        }

        return categories;
    }

    /**
     * Get questions based on category and difficulty
     */
    async getQuestions(category, difficulty, count = 20) {
        try {
            const filePrefix = categoryMap[category];
            if (!filePrefix) {
                throw new Error(`Invalid category: ${category}`);
            }

            const fileSuffix = difficultyMap[difficulty];
            if (!fileSuffix) {
                throw new Error(`Invalid difficulty: ${difficulty}`);
            }

            const fileName = `${filePrefix}_${fileSuffix}.json`;
            const filePath = path.join(QUESTIONS_DIR, fileName);

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);

            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid question file format');
            }

            // Shuffle and select random questions
            const shuffled = [...data.questions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(count, shuffled.length));

            return {
                subject: category,
                difficulty,
                questions: selected.map(q => ({
                    ...q,
                    questionText: q.question,
                    correctAnswer: q.correct_answer
                })),
                timeLimit: this.getTimeLimit(difficulty),
                totalAvailable: data.questions.length
            };
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    /**
     * Get random questions from any category
     */
    async getRandomQuestions(count = 20) {
        const categories = Object.keys(categoryMap);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const difficulties = ['easy', 'medium', 'hard'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        return this.getQuestions(randomCategory, randomDifficulty, count);
    }

    /**
     * Get time limit based on difficulty
     */
    getTimeLimit(difficulty) {
        const timeLimits = {
            'easy': 600,      // 10 minutes in seconds
            'medium': 1200,   // 20 minutes
            'hard': 1800,     // 30 minutes
            'mnc': 1800,
            'interview': 1800
        };
        return timeLimits[difficulty] || 1200;
    }

    /**
     * Get icon name for category
     */
    getCategoryIcon(category) {
        const icons = {
            'DSA': 'code',
            'OS': 'cpu',
            'SQL': 'database',
            'DBMS': 'server',
            'System Design': 'layout',
            'Networks': 'globe',
            'Aptitude': 'brain',
            'ML': 'trending-up',
            'DL': 'layers',
            'Gen-AI': 'sparkles'
        };
        return icons[category] || 'book';
    }
}

module.exports = new QuestionService();