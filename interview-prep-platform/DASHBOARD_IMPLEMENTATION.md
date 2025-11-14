# Dashboard Implementation Documentation

## Overview
Comprehensive dashboard with real-time analytics, performance tracking, and progress visualization matching the dark purple/pink gradient theme.

## 🎨 Design Theme
- **Background**: Dark gradient `linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)`
- **Cards**: Glass morphism effect with `rgba(30, 41, 59, 0.4)` and backdrop blur
- **Borders**: Purple accent `rgba(168, 85, 247, 0.2)`
- **Gradients**: Multiple color schemes for different categories
- **Animations**: Fade-in, hover lift, pulse effects

## 📊 Dashboard Components

### 1. Overview Section (Stats Cards)
**Location**: Top of dashboard
**API**: `GET /api/analytics/stats`

**Displays**:
- **Total Quizzes**: Number of completed quiz attempts
  - Icon: Trophy (purple-pink gradient)
  - Data: `stats.totalQuizzes`
  
- **Average Score**: Overall performance percentage
  - Icon: Target (blue-cyan gradient)
  - Data: `stats.averageScore` (rounded to 1 decimal)
  
- **Time Spent**: Total learning time
  - Icon: Clock (green gradient)
  - Data: `stats.totalTime` (formatted as hours/minutes)
  
- **Current Streak**: Consecutive days of activity
  - Icon: Flame (orange gradient)
  - Data: Calculated from `recentAttempts` dates

**Features**:
- Gradient backgrounds for each stat
- Hover lift animation
- Staggered fade-in animation

### 2. Performance Chart
**Location**: Left column, middle section
**API**: `GET /api/analytics/time-analytics?period={7|30|90}`

**Displays**:
- Line graph showing score trends over time
- SVG-based chart with gradient fill
- Interactive time period selector (7 days, 30 days, All time)

**Data Points**:
- X-axis: Dates
- Y-axis: Average score percentage (0-100%)
- Grid lines for better readability
- Gradient line and area fill

**Features**:
- Responsive SVG chart
- Gradient colors (purple to pink)
- Empty state with icon
- Smooth animations

### 3. Category Progress
**Location**: Right column, middle section
**API**: `GET /api/analytics/category-performance`

**Displays**:
- Progress bars for each subject category
- Percentage score for each category
- Quiz count and accuracy

**Categories** (with gradients):
1. DSA - Purple-Pink
2. OS - Blue-Cyan
3. SQL - Green
4. DBMS - Orange
5. System Design - Violet-Fuchsia
6. Networks - Cyan-Blue
7. Aptitude - Pink-Rose
8. ML/DL/GenAI - Teal-Green

**Features**:
- Horizontal progress bars with gradient fill
- Percentage and quiz count display
- Accuracy metrics
- Empty state for new users

### 4. Recent Attempts
**Location**: Left column, bottom section
**API**: `GET /api/quiz/attempts?limit=10`

**Displays**:
- Last 10 quiz attempts
- Subject, difficulty, score, time, date
- Color-coded performance badges

**Badge Colors**:
- Green (≥75%): Excellent performance
- Yellow (50-74%): Good performance
- Red (<50%): Needs improvement

**Features**:
- Hover lift effect on cards
- Icons for score, time, and date
- Responsive layout
- Empty state with trophy icon

### 5. Weak Areas
**Location**: Right column, bottom section
**API**: `GET /api/analytics/weak-areas`

**Displays**:
- Topics with accuracy < 60%
- Accuracy percentage
- Number of attempts
- Recommendations for practice

**Features**:
- Red-tinted warning cards
- Alert icon for each weak area
- Sorted by accuracy (lowest first)
- Empty state with award icon (for when no weak areas exist)

## 🔌 Backend API Endpoints

### Analytics Routes (`/api/analytics`)

#### 1. GET `/performance`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "data": {
    "overallStats": { ... },
    "subjectStats": { ... },
    "difficultyStats": { ... }
  }
}
```

#### 2. GET `/stats`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "data": {
    "totalQuizzes": 25,
    "averageScore": 78.5,
    "totalTime": 7200,
    "bestScore": 95
  }
}
```
**MongoDB Aggregation**:
- Groups all quiz attempts by user
- Calculates sum, average, max values
- Returns single stats object

#### 3. GET `/category-performance`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "category": "DSA",
      "quizzesTaken": 10,
      "averageScore": 82.5,
      "bestScore": 95,
      "accuracy": 85.3,
      "totalTime": 3600
    }
  ]
}
```
**MongoDB Aggregation**:
- Groups by subject
- Calculates averages and totals
- Computes accuracy percentage
- Sorts by average score

#### 4. GET `/weak-areas`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "topic": "OS",
      "accuracy": 45.5,
      "attempts": 3
    }
  ]
}
```
**MongoDB Aggregation**:
- Groups by subject
- Calculates accuracy
- Filters for accuracy < 60%
- Sorts by accuracy (ascending)

#### 5. GET `/time-analytics?period=7`
**Auth**: Required
**Query Params**: 
- `period`: 7, 30, or 90 days

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-14",
      "quizzes": 3,
      "averageScore": 78.5,
      "totalTime": 1200
    }
  ]
}
```
**MongoDB Aggregation**:
- Filters by date range
- Groups by date (YYYY-MM-DD format)
- Calculates daily averages
- Sorts chronologically

### User Routes (`/api/users`)

#### 1. GET `/profile`
**Auth**: Required
**Response**: User profile without password

#### 2. PUT `/profile`
**Auth**: Required
**Body**: `{ name, email }`
**Response**: Updated user profile

#### 3. PUT `/password`
**Auth**: Required
**Body**: `{ currentPassword, newPassword }`
**Response**: Success message

### Quiz Routes (`/api/quiz`)

#### 1. GET `/attempts?limit=10`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "subject": "DSA",
      "difficulty": "medium",
      "score": 16,
      "totalQuestions": 20,
      "percentage": 80,
      "timeTaken": 1200,
      "completedAt": "2025-11-14T10:30:00Z"
    }
  ]
}
```

## 🔧 Implementation Details

### Frontend (`Dashboard.jsx`)

**State Management**:
```javascript
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState(null);
const [categoryPerformance, setCategoryPerformance] = useState([]);
const [recentAttempts, setRecentAttempts] = useState([]);
const [weakAreas, setWeakAreas] = useState([]);
const [timeAnalytics, setTimeAnalytics] = useState([]);
const [timePeriod, setTimePeriod] = useState('7');
const [error, setError] = useState(null);
```

**Data Fetching**:
- Uses `Promise.all()` for parallel API calls
- Fetches all data on component mount
- Re-fetches when time period changes
- Handles errors gracefully

**Helper Functions**:
- `formatTime(seconds)`: Converts seconds to "Xh Ym" format
- `calculateStreak()`: Computes consecutive days from recent attempts

**Animations**:
- Fade-in on mount
- Staggered stat card animations
- Hover lift effects
- Pulse background blobs

### Backend Controllers

**Analytics Controller** (`analyticsController.js`):
- All functions use `express-async-handler`
- MongoDB aggregation for complex queries
- Proper error handling
- Sorted and rounded results

**User Controller** (`userController.js`):
- Profile CRUD operations
- Password update with bcrypt
- Proper authentication checks

**Quiz Controller** (`quizController.js`):
- Quiz attempt history
- Question bookmarking
- Score calculation
- XP and level system integration

## 📱 Responsive Design

**Breakpoints**:
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full grid layout)

**Grid Layouts**:
- Stats: `repeat(auto-fit, minmax(250px, 1fr))`
- Chart/Category: `repeat(auto-fit, minmax(500px, 1fr))`
- Recent/Weak: `repeat(auto-fit, minmax(500px, 1fr))`

## 🎯 Key Features

1. **Real-time Data**: All values fetched from database, no hardcoding
2. **MongoDB Aggregation**: Complex analytics computed efficiently
3. **Dark Theme**: Consistent purple/pink gradient styling
4. **Responsive**: Works on all screen sizes
5. **Error Handling**: Graceful fallbacks for API failures
6. **Empty States**: Helpful messages for new users
7. **Loading States**: Smooth loading animation
8. **Performance**: Optimized queries with proper indexing

## 🚀 Usage

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Dashboard**:
   - Navigate to `/dashboard` after login
   - Data loads automatically
   - Use time period filter for performance chart

## 📊 Data Flow

```
User Login → Dashboard Component → API Calls → MongoDB Aggregation → Response → State Update → Render UI
```

## 🔒 Security

- All routes protected with `protect` middleware
- JWT authentication required
- User can only access their own data
- Password hashing for password updates
- Input validation on all endpoints

## 🎨 Color Palette

- **Purple**: `#a855f7`
- **Pink**: `#ec4899`
- **Blue**: `#3b82f6`
- **Cyan**: `#06b6d4`
- **Green**: `#10b981`
- **Orange**: `#f59e0b`
- **Red**: `#ef4444`
- **Background**: `#0f172a`
- **Card**: `rgba(30, 41, 59, 0.4)`
- **Text Light**: `#e2e8f0`
- **Text Muted**: `#94a3b8`

## ✅ Testing Checklist

- [ ] Dashboard loads without errors
- [ ] All API endpoints return correct data
- [ ] Empty states display for new users
- [ ] Loading spinner shows during data fetch
- [ ] Time period filter updates chart
- [ ] Recent attempts show correct info
- [ ] Weak areas calculated properly (< 60%)
- [ ] Category progress bars animated
- [ ] Responsive on mobile devices
- [ ] Error messages display on API failure

## 📝 Notes

- Time period filter affects only the performance chart
- Streak calculation is simple (consecutive days)
- All percentages rounded to 1 decimal place
- SVG chart scales responsively
- Empty states encourage user engagement
