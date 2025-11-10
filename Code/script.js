/* script.js for TheTrueTest - Complete Quiz System */

const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const newTestBtn = document.getElementById('newTestBtn');
const quizContainer = document.getElementById('quizContainer');
const metaText = document.getElementById('metaText');
const quizMeta = document.getElementById('quizMeta');
const timerDisplay = document.getElementById('timerDisplay');
const timerText = document.getElementById('timerText');
const resultsContainer = document.getElementById('resultsContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const reviewContainer = document.getElementById('reviewContainer');

// Event listeners
if (startBtn) startBtn.addEventListener('click', startTest);
if (submitBtn) submitBtn.addEventListener('click', submitTest);
if (clearBtn) clearBtn.addEventListener('click', resetQuiz);
if (newTestBtn) newTestBtn.addEventListener('click', resetQuiz);

let currentQuestions = [];
let selectedAnswers = {};
let timerInterval = null;
let timeRemaining = 0;
let currentSubject = '';
let currentLevel = '';

function resolveFilePath(subjectValue, levelValue) {
  const numeric = subjectValue.match(/^(\d+)/);
  let prefix = subjectValue;
  let level = levelValue;

  if (levelValue === 'mnc') {
    if (numeric) {
      const n = Number(numeric[1]);
      if (n === 8 || n === 9 || n === 10) {
        level = 'interview';
      } else {
        level = 'mnc';
      }
    } else {
      level = 'mnc';
    }
  }

  return `../Questions/${prefix}_${level}.json`;
}

function getTimerDuration(level) {
  switch(level) {
    case 'easy': return 20 * 60; // 20 minutes
    case 'medium': return 30 * 60; // 30 minutes
    case 'hard': return 40 * 60; // 40 minutes
    case 'mnc':
    case 'interview': return 40 * 60; // 40 minutes for interview
    default: return 30 * 60;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer(duration) {
  timeRemaining = duration;
  timerDisplay.classList.remove('hidden');
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert('⏰ Time is up! Submitting your test automatically.');
      submitTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerText.textContent = formatTime(timeRemaining);
  if (timeRemaining <= 60) {
    timerText.style.color = '#ff4444';
  } else if (timeRemaining <= 300) {
    timerText.style.color = '#ff9944';
  } else {
    timerText.style.color = '#4CAF50';
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function startTest() {
  const subject = document.getElementById('subjectSelect').value;
  const level = document.getElementById('levelSelect').value;
  
  if (!subject || !level) {
    alert('⚠️ Please select both subject and difficulty level!');
    return;
  }

  currentSubject = subject;
  currentLevel = level;
  const filePath = resolveFilePath(subject, level);

  console.log('Loading file:', filePath);
  quizContainer.classList.remove('empty');
  quizContainer.innerHTML = `<p class="hint">Loading questions from <strong>${filePath}</strong> ...</p>`;

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let questions = data.questions || data;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found in file.');
    }

    // Randomly select 20 questions
    const shuffled = shuffleArray(questions);
    currentQuestions = shuffled.slice(0, Math.min(20, shuffled.length));
    selectedAnswers = {};

    displayQuestions();
    startTimer(getTimerDuration(level));
    
    // Update UI
    startBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    quizMeta.classList.remove('hidden');
    metaText.innerHTML = `📝 <strong>${currentQuestions.length}</strong> random questions — <em>${getSubjectName(subject)} / ${level.toUpperCase()}</em>`;
    
  } catch (err) {
    console.error(err);
    quizContainer.innerHTML = `
      <p style="color:#ff8b8b;text-align:center;margin:28px 0;">
        ❌ Could not load file: <strong>${filePath}</strong><br>
        Make sure the file exists in the Questions folder.<br>
        Error: ${err.message}
      </p>
    `;
    quizMeta.classList.add('hidden');
  }
}

function getSubjectName(subject) {
  const names = {
    '1Dsa': 'Data Structures & Algorithms',
    '2Os': 'Operating Systems',
    '3Sql': 'SQL',
    '4Dbms': 'DBMS',
    '5System_design': 'System Design',
    '6Networks': 'Computer Networks',
    '7Aptitude': 'Aptitude',
    '8ML': 'Machine Learning',
    '9DL': 'Deep Learning',
    '10Gen_Ai': 'Generative AI'
  };
  return names[subject] || subject;
}

function displayQuestions() {
  quizContainer.innerHTML = '';
  
  currentQuestions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question';
    
    // Normalize the question to have correct_answer as index
    normalizeQuestion(q);
    
    const optionsHtml = q.options.map((opt, optIdx) => `
      <label class="option">
        <input type="radio" name="q${idx}" value="${optIdx}" 
               onchange="recordAnswer(${idx}, ${optIdx})">
        <span>${opt}</span>
      </label>
    `).join('');
    
    card.innerHTML = `
      <div class="q-header">
        <div><strong>Q${idx + 1}.</strong> ${escapeHtml(q.question)}</div>
        ${q.topic ? `<div class="q-topic">${q.topic}</div>` : ''}
      </div>
      <div class="options">
        ${optionsHtml}
      </div>
    `;
    
    quizContainer.appendChild(card);
  });
}

// Helper function to normalize different JSON formats
function normalizeQuestion(q) {
  // If already has correct_answer as a number, we're good
  if (typeof q.correct_answer === 'number') {
    return;
  }
  
  // If has "answer" field (string), find matching option
  if (q.answer !== undefined) {
    const answerText = q.answer.toString().trim();
    
    // Check if answer is a letter (A, B, C, D)
    if (/^[A-D]$/i.test(answerText)) {
      q.correct_answer = answerText.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    } else {
      // Find the index of the option that matches the answer text
      q.correct_answer = q.options.findIndex(opt => 
        opt.toString().trim() === answerText
      );
      
      // If not found, log warning
      if (q.correct_answer === -1) {
        console.warn('Could not find matching option for answer:', answerText);
        console.warn('Options:', q.options);
        q.correct_answer = 0; // Default to first option
      }
    }
  }
}

function recordAnswer(questionIndex, optionIndex) {
  // Convert to number to match the JSON format
  selectedAnswers[questionIndex] = parseInt(optionIndex);
}

function submitTest() {
  const confirmSubmit = confirm('Are you sure you want to submit the test?');
  if (!confirmSubmit) return;
  
  stopTimer();
  
  // Calculate score
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  
  currentQuestions.forEach((q, idx) => {
    const userAnswer = selectedAnswers[idx];
    const correctAnswer = q.correct_answer;
    
    console.log(`Q${idx + 1}: User answered ${userAnswer}, Correct is ${correctAnswer}, Match: ${userAnswer === correctAnswer}`);
    
    if (userAnswer === undefined) {
      unanswered++;
    } else if (userAnswer === correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  });
  
  const totalQuestions = currentQuestions.length;
  const score = correct;
  const percentage = ((correct / totalQuestions) * 100).toFixed(2);
  
  // Hide quiz, show results
  quizContainer.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  submitBtn.classList.add('hidden');
  clearBtn.classList.add('hidden');
  quizMeta.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  
  // Display score
  let grade = '';
  if (percentage >= 90) grade = 'Excellent! 🌟';
  else if (percentage >= 75) grade = 'Great Job! 👍';
  else if (percentage >= 60) grade = 'Good Effort! 💪';
  else if (percentage >= 40) grade = 'Keep Practicing! 📚';
  else grade = 'Need More Practice! 🎯';
  
  scoreDisplay.innerHTML = `
    <div class="score-card">
      <h3>🎯 Your Score: ${score}/${totalQuestions}</h3>
      <p class="percentage">${percentage}%</p>
      <p class="grade">${grade}</p>
      <div class="score-breakdown">
        <p>✅ Correct: ${correct}</p>
        <p>❌ Wrong: ${wrong}</p>
        <p>⚪ Unanswered: ${unanswered}</p>
      </div>
    </div>
  `;
  
  // Display review
  displayReview();
  
  // Mark calendar if test completed
  if (correct > 0 || wrong > 0) {
    markTodayComplete();
  }
}

function displayReview() {
  let reviewHtml = '<h3>📝 Answer Review</h3>';
  
  currentQuestions.forEach((q, idx) => {
    const userAnswer = selectedAnswers[idx];
    const correctAnswer = q.correct_answer;
    const isCorrect = userAnswer === correctAnswer;
    const status = userAnswer === undefined ? 'unanswered' : (isCorrect ? 'correct' : 'wrong');
    
    reviewHtml += `
      <div class="review-item ${status}">
        <div class="review-header">
          <strong>Q${idx + 1}.</strong> ${escapeHtml(q.question)}
          ${status === 'correct' ? '✅' : status === 'wrong' ? '❌' : '⚪'}
        </div>
        <div class="review-options">
          ${q.options.map((opt, optIdx) => {
            let className = '';
            if (optIdx === correctAnswer) className = 'correct-option';
            if (optIdx === userAnswer && userAnswer !== correctAnswer) className = 'wrong-option';
            return `<div class="review-option ${className}">
              ${optIdx === userAnswer ? '👉 ' : ''}${opt}
              ${optIdx === correctAnswer ? ' ✓ (Correct Answer)' : ''}
            </div>`;
          }).join('')}
        </div>
        ${q.explanation ? `<div class="explanation">💡 <strong>Explanation:</strong> ${q.explanation}</div>` : ''}
      </div>
    `;
  });
  
  reviewContainer.innerHTML = reviewHtml;
}

function resetQuiz() {
  // Reset all state
  currentQuestions = [];
  selectedAnswers = {};
  stopTimer();
  
  // Reset UI
  quizContainer.classList.remove('hidden');
  quizContainer.classList.add('empty');
  quizContainer.innerHTML = `<p class="hint">Select subject & level, then click <strong>Start Test</strong> to begin your quiz with 20 random questions.</p>`;
  
  resultsContainer.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  quizMeta.classList.add('hidden');
  
  startBtn.classList.remove('hidden');
  submitBtn.classList.add('hidden');
  clearBtn.classList.add('hidden');
  
  document.getElementById('subjectSelect').value = '';
  document.getElementById('levelSelect').value = '';
  
  // Reset timer color
  timerText.style.color = '#4CAF50';
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Make recordAnswer available globally
window.recordAnswer = recordAnswer;

/* ============================================================= */
/* 🔥 STREAK TRACKER SECTION 🔥 */
/* ============================================================= */

const markTodayBtn = document.getElementById('markTodayBtn');
const streakCount = document.getElementById('streakCount');
const badge = document.getElementById('badge');
const calendarDiv = document.getElementById('calendar');

if (markTodayBtn) {
  markTodayBtn.addEventListener('click', markTodayComplete);
}

// Load streak data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadStreakData();
  renderCalendar();
});

function loadStreakData() {
  const data = JSON.parse(localStorage.getItem('streakData')) || {
    completedDays: [],
    currentStreak: 0
  };
  
  updateStreakDisplay(data);
  return data;
}

function saveStreakData(data) {
  localStorage.setItem('streakData', JSON.stringify(data));
}

function markTodayComplete() {
  const today = new Date().toDateString();
  const data = loadStreakData();
  
  if (!data.completedDays.includes(today)) {
    data.completedDays.push(today);
    data.currentStreak = calculateStreak(data.completedDays);
    saveStreakData(data);
    updateStreakDisplay(data);
    renderCalendar();
    alert('🎉 Great job! Today marked as complete!');
  } else {
    alert('✅ Today is already marked complete!');
  }
}

function calculateStreak(completedDays) {
  if (completedDays.length === 0) return 0;
  
  const sortedDays = completedDays
    .map(d => new Date(d))
    .sort((a, b) => b - a);
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let lastDate = sortedDays[0];
  lastDate.setHours(0, 0, 0, 0);
  
  // Check if the most recent completion is today or yesterday
  const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0; // Streak broken
  
  for (let i = 1; i < sortedDays.length; i++) {
    const current = sortedDays[i];
    const previous = sortedDays[i - 1];
    const diff = Math.floor((previous - current) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function updateStreakDisplay(data) {
  streakCount.textContent = data.currentStreak;
  
  let badgeText = '';
  if (data.currentStreak >= 30) badgeText = '🏆 Streak Master!';
  else if (data.currentStreak >= 14) badgeText = '🌟 Two Weeks Strong!';
  else if (data.currentStreak >= 7) badgeText = '🔥 One Week Streak!';
  else if (data.currentStreak >= 3) badgeText = '💪 Building Momentum!';
  else if (data.currentStreak > 0) badgeText = '👍 Keep Going!';
  
  badge.textContent = badgeText;
}

function renderCalendar() {
  const data = loadStreakData();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  let calendarHTML = '<div class="calendar-grid">';
  
  // Day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`;
  });
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>';
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toDateString();
    const isCompleted = data.completedDays.includes(dateString);
    const isToday = day === today.getDate();
    
    let className = 'calendar-day';
    if (isCompleted) className += ' completed';
    if (isToday) className += ' today';
    
    calendarHTML += `<div class="${className}">${day}</div>`;
  }
  
  calendarHTML += '</div>';
  calendarDiv.innerHTML = calendarHTML;
}
