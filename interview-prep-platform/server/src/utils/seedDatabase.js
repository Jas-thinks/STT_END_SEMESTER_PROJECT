const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('../models/Question');

const seedDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing questions
        await Question.deleteMany({});

        // Load questions from JSON files
        const questionsDir = path.join(__dirname, '../../data/questions');
        const files = fs.readdirSync(questionsDir);

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Insert questions into the database
            await Question.insertMany(questions);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

seedDatabase();