require('dotenv').config();

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewPrep',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@example.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
};

module.exports = envConfig;