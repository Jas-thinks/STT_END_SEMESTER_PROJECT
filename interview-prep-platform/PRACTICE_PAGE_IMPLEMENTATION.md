# Practice/Quiz Selection Page Implementation

## Overview
Comprehensive Practice page with category selection, difficulty configuration, and quiz initialization. Questions are loaded from JSON files in the `Questions` folder.

## 🎨 Design Theme
- **Background**: Dark gradient `linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)`
- **Cards**: Glass morphism with unique gradient per category
- **Animations**: Staggered fade-in, hover lift, pulse backgrounds
- **Modal**: Configuration modal with backdrop blur

## 📁 File Structure

### Questions Folder
```
Questions/
├── 1Dsa_easy.json
├── 1Dsa_medium.json
├── 1Dsa_hard.json
├── 1Dsa_mnc.json
├── 2Os_easy.json
├── 2Os_medium.json
├── 2Os_hard.json
├── 2Os_mnc.json
├── 3Sql_easy.json
... (and so on for all categories)
```

### Question File Format
```json
{
  "subject": "Data Structures and Algorithms",
  "difficulty": "Easy",
  "total_questions": 250,
  "questions": [
    {
      "id": 1,
      "topic": "Arrays",
      "question": "What is an array?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": 0
    }
  ]
}
```

## 🔌 Backend Implementation

### Question Service (`server/src/services/questionService.js`)

**Category Mapping**:
```javascript
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
```

**Key Methods**:

1. **`getCategories()`**
   - Scans Questions folder for all JSON files
   - Counts total questions per category
   - Returns category metadata with icons

2. **`getQuestions(category, difficulty, count)`**
   - Loads specific JSON file based on category and difficulty
   - Shuffles questions randomly
   - Returns specified number of questions
   - Includes time limit based on difficulty

3. **`getRandomQuestions(count)`**
   - Selects random category and difficulty
   - Returns random quiz configuration

4. **`getTimeLimit(difficulty)`**
   - Easy: 600 seconds (10 minutes)
   - Medium: 1200 seconds (20 minutes)
   - Hard: 1800 seconds (30 minutes)

### API Endpoints

#### 1. GET `/api/quiz/categories`
**Auth**: Required
**Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "name": "DSA",
      "displayName": "DSA",
      "totalQuestions": 1000,
      "icon": "code"
    }
  ]
}
```

#### 2. GET `/api/quiz/questions?subject=DSA&difficulty=medium&count=20`
**Auth**: Required
**Query Params**:
- `subject`: Category name (DSA, OS, SQL, etc.)
- `difficulty`: easy, medium, hard
- `count`: Number of questions (default: 20)

**Response**:
```json
{
  "success": true,
  "data": {
    "subject": "DSA",
    "difficulty": "medium",
    "questions": [...],
    "timeLimit": 1200,
    "totalAvailable": 500
  }
}
```

#### 3. GET `/api/quiz/random?count=20`
**Auth**: Required
**Response**: Same as `/questions` with random category/difficulty

### Updated Quiz Submission
**POST `/api/quiz/submit`**
**Body**:
```json
{
  "subject": "DSA",
  "difficulty": "medium",
  "answers": [
    {
      "questionId": 1,
      "userAnswer": 2,
      "correctAnswer": 2,
      "timeTaken": 30
    }
  ],
  "questions": [...], // Original questions for validation
  "timeTaken": 600,
  "timeAllotted": 1200
}
```

## 🎨 Frontend Implementation

### Practice Page (`frontend/src/pages/Practice.jsx`)

**State Management**:
```javascript
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedCategory, setSelectedCategory] = useState(null);
const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
const [showConfig, setShowConfig] = useState(false);
```

### Components

#### 1. Quick Actions Section
**Random Quiz Button**:
- Calls `/api/quiz/random`
- Navigates to quiz page with random questions
- Purple-gradient card with Shuffle icon

**Daily Challenge** (Coming Soon):
- Orange-gradient card
- Placeholder for future feature

#### 2. Category Grid
**Features**:
- 9-10 category cards in responsive grid
- Each card shows:
  - Category icon with unique gradient background
  - Category name
  - Total questions available
  - Selection indicator
- Staggered fade-in animation
- Hover lift effect

**Category Gradients**:
1. DSA: Purple-Pink
2. OS: Blue-Cyan
3. SQL: Green
4. DBMS: Orange
5. System Design: Violet-Fuchsia
6. Networks: Cyan-Blue
7. Aptitude: Pink-Rose
8. ML: Teal-Green
9. DL: Indigo-Violet
10. Gen-AI: Orange-Amber

#### 3. Quiz Configuration Modal
**Triggered**: When category is selected
**Features**:
- Backdrop blur overlay
- Glass morphism card
- Difficulty selector (Easy, Medium, Hard)
- Shows time limit for each difficulty
- Fixed 20 questions per quiz
- Start Quiz and Cancel buttons

**Difficulty Selection**:
- Easy: 10 min, Green indicator
- Medium: 20 min, Yellow indicator
- Hard: 30 min, Red indicator

### Navigation Flow
```
Practice Page → Select Category → Configure (Difficulty) → Start Quiz → Quiz Page
```

**Navigation State**:
```javascript
navigate('/quiz', {
  state: {
    questions: [...],        // Array of 20 questions
    subject: "DSA",          // Selected category
    difficulty: "medium",    // Selected difficulty
    timeLimit: 1200          // Time in seconds
  }
});
```

## 🎯 Features

### ✅ Implemented
1. **Category Display**
   - Dynamic loading from Questions folder
   - Question count per category
   - Visual category selection

2. **Quiz Configuration**
   - Difficulty selection (Easy, Medium, Hard)
   - Fixed 20 questions
   - Time limits: 10/20/30 minutes

3. **Quick Start Options**
   - Random Quiz button
   - One-click quiz start

4. **Backend Integration**
   - Questions loaded from JSON files
   - No database dependency
   - Fast question retrieval

5. **Dark Theme**
   - Consistent purple/pink gradient
   - Glass morphism effects
   - Smooth animations

### 🔄 Data Flow

```
User Clicks Category
    ↓
Opens Configuration Modal
    ↓
Selects Difficulty
    ↓
Clicks "Start Quiz"
    ↓
API Call: GET /api/quiz/questions
    ↓
Backend: Load JSON file → Shuffle → Select 20 questions
    ↓
Frontend: Receive questions + timeLimit
    ↓
Navigate to /quiz with state
    ↓
Quiz Page renders questions
```

## 🎨 Styling Details

### Category Card
```css
.category-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
}

.category-card:hover {
  transform: translateY(-8px);
}

.category-card.selected {
  border: 2px solid gradient-color;
}
```

### Configuration Modal
```css
.modal-backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}

.difficulty-btn.active {
  background: linear-gradient(to right, #a855f7, #ec4899);
  color: white;
}
```

## 🔧 Configuration

### Question Count
**Fixed**: 20 questions per quiz
- Cannot be changed by user
- Ensures consistent quiz length
- Optimal for timed practice

### Time Limits
**By Difficulty**:
- Easy: 10 minutes (30 seconds/question)
- Medium: 20 minutes (60 seconds/question)
- Hard: 30 minutes (90 seconds/question)

## 📊 Category Icons

| Category       | Icon          | Lucide Icon   |
|----------------|---------------|---------------|
| DSA            | Code          | `<Code />`    |
| OS             | CPU           | `<Cpu />`     |
| SQL            | Database      | `<Database />` |
| DBMS           | Server        | `<Server />`  |
| System Design  | Layout        | `<Layout />`  |
| Networks       | Globe         | `<Globe />`   |
| Aptitude       | Brain         | `<Brain />`   |
| ML             | Trending Up   | `<TrendingUp />`|
| DL             | Layers        | `<Layers />`  |
| Gen-AI         | Sparkles      | `<Sparkles />`|

## 🚀 Usage

### Starting a Quiz
1. Navigate to `/practice`
2. Browse available categories
3. Click on a category card
4. Select difficulty level
5. Click "Start Quiz"
6. Questions load and timer starts

### Random Quiz
1. Click "Random Quiz" button
2. System selects random category and difficulty
3. 20 questions loaded automatically
4. Immediately navigates to quiz page

## 🧪 Testing

### Manual Testing Checklist
- [ ] All categories load correctly
- [ ] Question counts display accurately
- [ ] Category selection highlights card
- [ ] Modal opens on category click
- [ ] Difficulty buttons work
- [ ] Time limit updates per difficulty
- [ ] Start Quiz navigates to /quiz
- [ ] Random Quiz works
- [ ] Loading state displays
- [ ] Responsive on mobile
- [ ] Animations smooth
- [ ] Theme consistent

### API Testing
```bash
# Get categories
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/quiz/categories

# Get questions
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/quiz/questions?subject=DSA&difficulty=medium&count=20"

# Get random quiz
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/quiz/random?count=20"
```

## 📝 Notes

- Questions are NOT stored in MongoDB
- All questions load from JSON files in `Questions/` folder
- File naming convention: `{number}{Category}_{difficulty}.json`
- Special cases: ML, DL, Gen-AI have `interview` instead of `mnc`
- Question shuffling ensures different quiz each time
- Time limits are enforced on Quiz Page (not Practice page)

## 🔮 Future Enhancements

- [ ] Daily Challenge feature
- [ ] Continue Last Quiz
- [ ] Topic filtering within categories
- [ ] Custom quiz creation
- [ ] Bookmarked questions quiz
- [ ] Weak areas practice
- [ ] Timed vs Untimed mode toggle
- [ ] Practice mode (no time limit)
- [ ] Review mode (see answers immediately)
