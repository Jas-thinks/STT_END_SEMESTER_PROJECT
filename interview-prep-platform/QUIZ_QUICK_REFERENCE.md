# Quiz System Quick Reference

## 🚀 Quick Start

### 1. Start Quiz from Practice Page
```javascript
// Practice.jsx automatically handles:
- Loading categories from Questions folder
- Displaying question counts
- Navigating to quiz with proper state
```

### 2. Quiz Page Navigation
- **Previous**: Go back one question
- **Next**: Advance to next question
- **Flag**: Mark for review (shows in palette)
- **Palette**: Grid view of all questions
- **Submit**: End quiz (on last question)

### 3. Timer System
- Auto-starts on quiz load
- 5-minute warning modal
- Color changes: Green → Orange → Red
- Auto-submits when time = 0

## 📋 Component Props

### Timer
```jsx
<Timer 
  initialTime={1200}           // seconds
  onTimeEnd={handleSubmit}     // callback
  onTimeUpdate={updateState}   // each second
  autoSubmit={true}            // auto-submit on 0
/>
```

### QuestionDisplay
```jsx
<QuestionDisplay
  question={questionObj}       // question data
  questionNumber={5}           // current #
  totalQuestions={20}          // total
  selectedAnswer={2}           // user's answer
  onAnswerSelect={handleAns}   // callback
  showResult={false}           // review mode
  correctAnswer={2}            // correct index
/>
```

## 🎨 Status Colors

### Question Palette
- **Green Border**: Answered
- **Orange Border**: Flagged
- **Gray Border**: Not answered
- **Blue Border**: Current question

### Timer
- **Green**: >50% time remaining
- **Orange**: 25-50% remaining
- **Red**: <25% remaining

### Results
- **Green**: Correct answers
- **Red**: Incorrect answers
- **Purple**: Accent/borders

## 📊 Key State Variables

```javascript
// QuizPage.jsx
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState(Array(20).fill(null));
const [flaggedQuestions, setFlaggedQuestions] = useState([]);
const [timeRemaining, setTimeRemaining] = useState(1200);
const [showPalette, setShowPalette] = useState(false);
const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
```

## 🔌 API Endpoints

```bash
# Get categories
GET /api/quiz/categories

# Get questions
GET /api/quiz/questions?subject=DSA&difficulty=medium&count=20

# Random quiz
GET /api/quiz/random?count=20

# Submit quiz
POST /api/quiz/submit
{
  "subject": "DSA",
  "difficulty": "medium",
  "answers": [...],
  "questions": [...],
  "timeTaken": 1050,
  "timeAllotted": 1200
}

# Save progress (future)
POST /api/quiz/save-progress

# Get attempt
GET /api/quiz/attempt/:attemptId
```

## 🎯 Question Object Structure

```javascript
{
  id: 1,
  topic: "Arrays",
  question: "What is an array?",
  options: ["A", "B", "C", "D"],
  correct_answer: 0,         // index (0-3)
  code: "...",              // optional
  image: "...",             // optional
  explanation: "..."        // optional
}
```

## 🔄 Navigation State

```javascript
// From Practice → Quiz
navigate('/quiz', {
  state: {
    questions: [...],      // Array of 20 questions
    subject: "DSA",        // Category
    difficulty: "medium",  // Difficulty
    timeLimit: 1200       // Seconds
  }
});

// From Quiz → Result
navigate('/result', {
  state: {
    quizAttempt: {...},   // Quiz data
    questions: [...],     // Questions
    answers: [...]        // User answers
  }
});
```

## ⚡ Performance Tips

1. **Questions load once** - Passed via state
2. **Timer uses intervals** - Cleaned up on unmount
3. **Modals use portals** - Better rendering
4. **CSS animations** - Hardware accelerated
5. **Lazy imports** - Smaller bundle

## 🐛 Common Fixes

### Timer not working
```javascript
// Ensure initialTime is a number
<Timer initialTime={Number(timeLimit)} />
```

### Questions not showing
```javascript
// Check navigation state
const { questions } = location.state || {};
if (!questions) navigate('/practice');
```

### Submit fails
```javascript
// Verify question structure
const answersData = questions.map((q, index) => ({
  questionId: q.id || index,
  userAnswer: answers[index] !== null ? answers[index] : -1,
  correctAnswer: q.correct_answer
}));
```

## 📱 Keyboard Shortcuts (Future)

- `←` Previous question
- `→` Next question
- `F` Flag question
- `P` Open palette
- `S` Submit quiz
- `1-4` Select option A-D

## 🎨 CSS Classes

### Question States
```css
.palette-item.answered     /* Green */
.palette-item.flagged      /* Orange */
.palette-item.unanswered   /* Gray */
.palette-item.current      /* Blue border */
```

### Timer States
```css
.timer-display             /* Normal */
.timer-display.timer-warning    /* Orange */
.timer-display.timer-critical   /* Red */
```

### Option States
```css
.question-option           /* Default */
.option-selected          /* User selected */
.option-correct           /* Correct (review) */
.option-incorrect         /* Wrong (review) */
```

## 📏 Dimensions

```css
/* Timer */
Timer height: auto
Timer padding: 16px 20px

/* Question Display */
Question padding: 32px
Border radius: 16px

/* Options */
Option padding: 16px 20px
Option gap: 12px

/* Modal */
Modal max-width: 600px
Modal padding: 32px
```

## 🎬 Animations

```css
fadeIn: 0.4s ease
slideUp: 0.3s ease
pulse: 2s infinite (warning)
pulse: 1s infinite (critical)
bounce: 1s ease-in-out
```

## 🔢 Magic Numbers

- **Questions**: 20 per quiz
- **Timer Warning**: 300s (5 min)
- **Timer Critical**: 60s (1 min)
- **Options**: Max 6 (A-F)
- **XP Base**: 50 points
- **XP Per Correct**: 10 points

## ✅ Validation Rules

```javascript
// Quiz must have
- At least 1 question
- Valid subject & difficulty
- Time limit > 0

// Submission requires
- All question IDs
- User answers (can be null/-1)
- Correct answers
- Time taken & allotted
```

## 🎯 Success Criteria

A quiz is complete when:
1. ✅ Timer reaches 0 (auto-submit)
2. ✅ User clicks Submit → Confirms
3. ✅ All answers recorded
4. ✅ Saved to database
5. ✅ XP awarded
6. ✅ Results displayed

## 📞 Support

For issues:
1. Check browser console
2. Verify API responses
3. Check navigation state
4. Review question JSON format
5. Ensure authentication

---

**Last Updated**: Quiz Workflow Implementation Complete
**Version**: 1.0.0
**Status**: ✅ Production Ready
