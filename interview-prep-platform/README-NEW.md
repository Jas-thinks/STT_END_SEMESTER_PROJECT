# 🎯 TheTrueTest - Interview Preparation Platform

> **Full-Stack MERN Application for Technical Interview Preparation**

Built by **Jaswinder Singh, IIT Bhilai**

## 🚀 Tech Stack

### Backend
- **Express.js** - RESTful API server
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication & authorization
- **Bcrypt** - Password hashing
- **Express Async Handler** - Error handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling (optional)

## 📁 Project Structure

```
interview-prep-platform/
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/        # Database & environment config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Entry point
│
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   ├── package.json
│   └── vite.config.js
│
└── data/                  # Question JSON files
    └── questions/
        ├── dsa/
        ├── os/
        ├── sql/
        └── ...
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform
```

2. **Run the quick start script**
```bash
./quickstart.sh
```

### Manual Setup

#### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Edit with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

#### Database Seeding
```bash
cd server
node src/utils/seedDatabase.js
```

## 🔧 Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-prep-platform
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user
PUT    /api/auth/updatepassword # Update password
GET    /api/auth/logout        # Logout user
```

### Quiz
```
GET    /api/quiz/questions     # Get random questions
POST   /api/quiz/submit        # Submit quiz attempt
GET    /api/quiz/history       # Get quiz history
GET    /api/quiz/:id           # Get quiz details
POST   /api/quiz/bookmark/:id  # Bookmark question
GET    /api/quiz/bookmarks     # Get bookmarked questions
```

### Analytics
```
GET    /api/analytics/performance  # Get user performance
GET    /api/analytics/leaderboard  # Get leaderboard
GET    /api/analytics/stats        # Get quiz statistics
```

## 🎮 Features

### ✅ Implemented
- User authentication (register, login, JWT)
- Random question generation (20 per quiz)
- Multiple subjects (DSA, OS, SQL, DBMS, etc.)
- Difficulty levels (Easy, Medium, Hard, MNC, Interview)
- Timer system (20/30/40 min based on difficulty)
- Score calculation
- XP & leveling system
- Streak tracking
- Performance analytics
- Leaderboard
- Question bookmarking
- Quiz history

### 🚧 To Be Implemented
- Progress bar
- Theme toggle (dark/light mode)
- Keyboard shortcuts
- Question navigation panel
- Motivational quotes
- Confetti animations
- Social sharing
- AI-powered insights
- Study groups
- Daily challenges

## 💻 Running the Application

### Terminal 1 - Backend
```bash
cd interview-prep-platform/server
npm run dev

# Server will run on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd interview-prep-platform/client
npm run dev

# Frontend will run on http://localhost:5173
```

### Terminal 3 - MongoDB (if not running as service)
```bash
mongod
```

## 📊 Database Models

### User
- Name, email, password
- Level, XP, streak
- Badges, bookmarked questions
- Role (user/admin)

### Question
- Question text, options
- Correct answer, subject, difficulty
- Explanation, video links
- Statistics (attempts, accuracy)

### QuizAttempt
- User reference
- Questions with answers
- Score, percentage, time taken
- XP earned, badges

### Performance
- Overall stats
- Subject-wise stats
- Difficulty-wise stats
- Weak/strong topics

## 🎨 Frontend Features

### Pages
- **Home** - Landing page
- **Login/Register** - Authentication
- **Dashboard** - User performance overview
- **Quiz** - Take quiz
- **Leaderboard** - Rankings
- **Practice** - Topic-wise practice

### Components
- **Navbar** - Navigation header
- **Footer** - Footer with links
- **Timer** - Countdown timer
- **QuestionDisplay** - Question UI
- **ResultSummary** - Quiz results
- **ProgressChart** - Performance graphs

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected routes
- CORS configuration
- Input validation
- Error handling

## 📝 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

**Jaswinder Singh**
- Institution: IIT Bhilai
- Project: STT End Semester Project

## 🙏 Acknowledgments

- Original vanilla JS version as foundation
- MERN stack community
- MongoDB documentation
- React documentation

## 📞 Support

For issues or questions, please check:
1. `COMPLETE_IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
2. Server logs in terminal
3. Browser console for frontend errors

---

**Built with ❤️ for interview preparation** 🎯
