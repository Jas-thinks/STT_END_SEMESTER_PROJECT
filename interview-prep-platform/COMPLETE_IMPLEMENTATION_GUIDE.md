# 🚀 Complete Express + React Migration Guide for TheTrueTest

This guide provides the complete implementation for migrating your vanilla JS quiz app to a full-stack Express + React application.

## 📦 Installation Steps

### Backend Setup
```bash
cd interview-prep-platform/server
npm install express mongoose dotenv bcryptjs jsonwebtoken cors express-async-handler helmet express-rate-limit morgan
```

### Frontend Setup
```bash
cd interview-prep-platform/client
npm install react react-dom react-router-dom axios react-hot-toast zustand framer-motion chart.js react-chartjs-2
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer
```

## 🗂️ Complete File Structure

### Backend Files (Already Created)
✅ server/.env
✅ server/src/config/env.js
✅ server/src/config/database.js
✅ server/src/models/User.js
✅ server/src/models/Question.js
✅ server/src/models/QuizAttempt.js
✅ server/src/models/Performance.js
✅ server/src/controllers/authController.js (partial - see authController-new.js)
✅ server/src/controllers/quizController.js (partial - see quizController-new.js)

### Files to Create

#### 1. server/src/middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized`);
        }
        next();
    };
};
```

#### 2. server/src/middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.log(err.stack.red);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new Error(message);
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message);
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
```

#### 3. server/src/routes/authRoutes.js
```javascript
const express = require('express');
const {
    register,
    login,
    getMe,
    updatePassword,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);

module.exports = router;
```

#### 4. server/src/routes/quizRoutes.js
```javascript
const express = require('express');
const {
    getQuestions,
    submitQuiz,
    getQuizHistory,
    getQuizAttempt,
    bookmarkQuestion,
    getBookmarkedQuestions
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/:id', protect, getQuizAttempt);
router.post('/bookmark/:questionId', protect, bookmarkQuestion);

module.exports = router;
```

#### 5. server/src/controllers/analyticsController.js
```javascript
const Performance = require('../models/Performance');
const QuizAttempt = require('../models/QuizAttempt');
const asyncHandler = require('express-async-handler');

exports.getPerformance = asyncHandler(async (req, res) => {
    let performance = await Performance.findOne({ user: req.user.id });

    if (!performance) {
        performance = await Performance.create({ user: req.user.id });
    }

    res.json({
        success: true,
        data: performance
    });
});

exports.getLeaderboard = asyncHandler(async (req, res) => {
    const { timeframe = 'all', subject, limit = 10 } = req.query;

    let dateFilter = {};
    if (timeframe === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = { completedAt: { $gte: weekAgo } };
    } else if (timeframe === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = { completedAt: { $gte: monthAgo } };
    }

    const matchQuery = { ...dateFilter };
    if (subject) matchQuery.subject = subject;

    const leaderboard = await QuizAttempt.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$user',
                totalQuizzes: { $sum: 1 },
                averageScore: { $avg: '$score' },
                averagePercentage: { $avg: '$percentage' },
                totalXP: { $sum: '$xpEarned' }
            }
        },
        { $sort: { totalXP: -1 } },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        { $unwind: '$userInfo' },
        {
            $project: {
                userId: '$_id',
                name: '$userInfo.name',
                level: '$userInfo.level',
                xp: '$userInfo.xp',
                totalQuizzes: 1,
                averageScore: 1,
                averagePercentage: 1,
                totalXP: 1
            }
        }
    ]);

    res.json({
        success: true,
        data: leaderboard
    });
});
```

#### 6. server/server.js (Updated)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const { PORT, CLIENT_URL } = require('./src/config/env');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

// CORS
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

// Dev logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const userRoutes = require('./src/routes/userRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🎨 Frontend Implementation

### 1. client/src/services/api.js
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

### 2. client/src/services/authService.js
```javascript
import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};
```

### 3. client/src/context/AuthContext.jsx
```javascript
import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = await authService.getCurrentUser();
                setUser(data.data);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.data);
            toast.success('Login successful!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.data);
            toast.success('Registration successful!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

### 4. client/src/App.jsx (Complete)
```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import Leaderboard from './pages/Leaderboard';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Protected Route
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quiz"
                            element={
                                <ProtectedRoute>
                                    <QuizPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <Leaderboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <Footer />
                    <Toaster position="top-right" />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

## 🗄️ Database Seeding Script

Create `server/src/utils/seedDatabase.js` to import your JSON questions:

```javascript
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Question = require('../models/Question');
const connectDB = require('../config/database');

const subjectMap = {
    '1Dsa': 'DSA',
    '2Os': 'OS',
    '3Sql': 'SQL',
    '4Dbms': 'DBMS',
    '5System_design': 'System Design',
    '6Networks': 'Networks',
    '7Aptitude': 'Aptitude',
    '8ML': 'ML',
    '9DL': 'DL',
    '10Gen_Ai': 'GenAI'
};

const seedDatabase = async () => {
    await connectDB();

    const questionsDir = path.join(__dirname, '../../../Questions');
    const files = await fs.readdir(questionsDir);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const [subjectKey, difficulty] = file.replace('.json', '').split('_');
            const subject = subjectMap[subjectKey];

            const data = JSON.parse(
                await fs.readFile(path.join(questionsDir, file), 'utf-8')
            );

            const questions = Array.isArray(data) ? data : data.questions || [];

            const formattedQuestions = questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correct_answer !== undefined ? 
                    parseInt(q.correct_answer) : 
                    parseAnswerFormat(q.answer, q.options),
                subject,
                difficulty: difficulty.toLowerCase(),
                isActive: true
            }));

            await Question.insertMany(formattedQuestions);
            console.log(`✅ Imported ${formattedQuestions.length} questions from ${file}`);
        }
    }

    console.log('🎉 Database seeding completed!');
    process.exit(0);
};

function parseAnswerFormat(answer, options) {
    // Handle letter format (A, B, C, D)
    if (['A', 'B', 'C', 'D'].includes(answer)) {
        return ['A', 'B', 'C', 'D'].indexOf(answer);
    }
    
    // Handle text matching option
    if (options) {
        const index = options.indexOf(answer);
        if (index !== -1) return index;
    }
    
    return 0;
}

seedDatabase().catch(err => {
    console.error(err);
    process.exit(1);
});
```

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd interview-prep-platform/server
npm install
npm run seed  # Import questions (add script to package.json)
npm run dev   # Start backend server
```

### Terminal 2 - Frontend
```bash
cd interview-prep-platform/client
npm install
npm run dev   # Start Vite dev server
```

### Terminal 3 - MongoDB
```bash
mongod  # Make sure MongoDB is running
```

## 📝 Next Steps

1. Replace controller files with -new versions
2. Create remaining React components
3. Add Tailwind CSS styling
4. Implement quiz timer, progress bar
5. Add all interactive features from vanilla JS
6. Test the complete flow

Would you like me to create the remaining React components?
