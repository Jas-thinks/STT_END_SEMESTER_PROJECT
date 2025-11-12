const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const { PORT, CLIENT_URL, NODE_ENV } = require('./src/config/env');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

// Dev logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TheTrueTest Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});