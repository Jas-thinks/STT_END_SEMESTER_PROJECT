require('dotenv').config();

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep-platform',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@example.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
};

require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep-platform',
    JWT_SECRET: process.env.JWT_SECRET || 'thetruetestsecretkey2025',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    SESSION_SECRET: process.env.SESSION_SECRET || 'thetruetestsessionsecret'
};