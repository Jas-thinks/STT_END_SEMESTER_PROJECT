/* script.js for TheTrueTest
   Assumes your JSON files live in ./data/
   Filenames must match exactly the user's list:
   e.g. data/1Dsa_easy.json, data/1Dsa_mnc.json, data/8ML_interview.json, etc.
*/

const startBtn = document.getElementById('startBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const clearBtn = document.getElementById('clearBtn');
const quizContainer = document.getElementById('quizContainer');
const metaText = document.getElementById('metaText');
const quizMeta = document.getElementById('quizMeta');

// Ensure elements exist before adding listeners (standard practice)
if (startBtn) startBtn.addEventListener('click', loadQuestions);
if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleCurrent);
if (clearBtn) clearBtn.addEventListener('click', clearQuiz);

let currentQuestions = [];
let currentFilePath = null;

function subjectPrefix(subjectValue) {
  // subjectValue already expected like "1Dsa" or "10Gen_Ai"
  return subjectValue;
}

function resolveFilePath(subjectValue, levelValue) {
  // The user's file list: mostly "<prefix>_<level>.json"
  // Special-case: for subjects 8,9,10 the MNC file is named "<prefix>_interview.json"
  // So if levelValue === 'mnc' and subjectValue in [8,9,10], map to 'interview'
  const numeric = subjectValue.match(/^(\d+)/);
  let prefix = subjectValue;
  let level = levelValue;

  if (levelValue === 'mnc') {
    if (numeric) {
      const n = Number(numeric[1]);
      // Note: The original code logic was slightly redundant here.
      // If we are in the 'mnc' block, and n is 8, 9, or 10, it changes to 'interview'.
      // Otherwise, it correctly remains 'mnc'.
      if (n === 8 || n === 9 || n === 10) {
        level = 'interview';
      } else {
        level = 'mnc'; // Explicitly keep 'mnc' for other numbers
      }
    } else {
      level = 'mnc';
    }
  }

  return `data/${prefix}_${level}.json`;
}

async function loadQuestions() {
  const subject = document.getElementById('subjectSelect').value;
  const level = document.getElementById('levelSelect').value;
  const filePath = resolveFilePath(subject, level);
  currentFilePath = filePath;

  console.log('Loading file:', filePath);
  quizContainer.classList.remove('empty');
  quizContainer.innerHTML = `<p class="hint">Loading questions from <strong>${filePath}</strong> ...</p>`;

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const questions = await res.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found in file (empty or wrong format).');
    }

    currentQuestions = questions.slice(); // copy
    showQuestions(currentQuestions);
    quizMeta.classList.remove('hidden');
    metaText.innerHTML = `Loaded <strong>${questions.length}</strong> questions — <em>${subject} / ${level}</em>`;
  } catch (err) {
    console.error(err);
    quizContainer.innerHTML = `
      <p style="color:#ff8b8b;text-align:center;margin:28px 0;">
        ❌ Could not load file: <strong>${filePath}</strong><br>
        Make sure the file exists and the filename is exact (case-sensitive).<br>
        Open the browser console for the full error.
      </p>
    `;
    quizMeta.classList.add('hidden');
    currentQuestions = [];
  }
}

function showQuestions(questions) {
  quizContainer.innerHTML = '';
  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question';
    const qHtml = `
      <div class="q-header">
        <div><strong>Q${idx+1}.</strong></div>
        <div class="q-id" style="color:var(--muted);font-size:13px">ID: ${q.id ?? 'N/A'}</div>
      </div>
      <div class="q-text">${escapeHtml(q.question ?? 'No question text')}</div>
      <div class="options">
        ${renderOptions(q.options ?? [], idx)}
      </div>
    `;
    card.innerHTML = qHtml;
    quizContainer.appendChild(card);
  });

  const footer = document.createElement('div');
  footer.className = 'controls-footer';
  footer.innerHTML = `
    <button class="btn-secondary" id="showAnswersBtn">Show Answers</button>
    <button class="btn-secondary" id="downloadBtn">Download JSON</button>
    <button id="submitQuizBtn">Submit Quiz</button>
  `;
  quizContainer.appendChild(footer);

  document.getElementById('submitQuizBtn').addEventListener('click', () => checkAnswers(questions));
  document.getElementById('showAnswersBtn').addEventListener('click', () => showAnswers(questions));
  document.getElementById('downloadBtn').addEventListener('click', () => downloadCurrentJson());
}

function renderOptions(options, questionIndex) {
  if (!Array.isArray(options) || options.length === 0) return '<div style="color:var(--muted)">No options available</div>';
  // Use a predictable name for radio buttons (e.g., q0, q1, q2...) instead of random math
  const radioName = `q${questionIndex}`; 
  return options.map(opt => {
    const val = escapeHtml(opt);
    return `<label><input type="radio" name="${radioName}" value="${val}"> ${val}</label>`;
  }).join('');
}

function checkAnswers(questions) {
  let correct = 0;
  let total = questions.length;

  // We find inputs by iterating question cards
  const questionCards = document.querySelectorAll('.question');
  questionCards.forEach((card, i) => {
    const radios = card.querySelectorAll(`input[type="radio"][name="q${i}"]`); // Use specific name
    let selected = null;
    radios.forEach(r => { if (r.checked) selected = r.value; });
    
    // Normalize answer key to handle both 'answer' and 'correct'
    const ans = questions[i].answer ?? questions[i].correct ?? null; 
    
    // Remove previous visual feedback
    card.style.border = ''; 

    if (selected && ans && selected === ans) {
      correct++;
      card.style.border = '1px solid rgba(40,255,120,0.12)'; // Correct color
    } else if (selected) {
      // Incorrectly answered
      card.style.border = '1px solid rgba(255,80,100,0.08)'; // Incorrect color
    } else {
       // Unanswered
      card.style.border = '1px solid var(--muted)'; 
    }
  });

  // show result popup badge
  const badge = document.createElement('div');
  badge.className = 'score-badge';
  badge.textContent = `Score: ${correct} / ${total}`;
  quizMeta.innerHTML = '';
  quizMeta.appendChild(badge);
  quizMeta.classList.remove('hidden');
}

function showAnswers(questions) {
  // reveal correct answers visually
  const cards = document.querySelectorAll('.question');
  cards.forEach((card, idx) => {
    const ans = questions[idx].answer ?? questions[idx].correct ?? null;
    if (!ans) return;
    const labels = [...card.querySelectorAll('label')];
    labels.forEach(lbl => {
      // Use the radio button's value, which is the escaped option text
      const radio = lbl.querySelector('input[type="radio"]');
      if (radio) {
          const radioValue = radio.value;
          if (radioValue === ans) {
              lbl.style.background = 'linear-gradient(90deg, rgba(43,140,255,0.09), rgba(43,140,255,0.03))';
              lbl.style.border = `1px solid rgba(43,140,255,0.12)`;
              lbl.style.color = '#dff3ff';
          }
      }
    });
  });
}

function downloadCurrentJson() {
  if (!currentFilePath) return alert('Load a quiz first.');
  // download the file from server or use currentQuestions
  const data = JSON.stringify(currentQuestions, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentFilePath.split('/').pop() || 'questions.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function clearQuiz() {
  quizContainer.innerHTML = `<p class="hint">Select subject & level, then click <strong>Load Questions</strong>.</p>`;
  quizMeta.classList.add('hidden');
  currentQuestions = [];
  currentFilePath = null;
}

function shuffleCurrent() {
  if (!currentQuestions || currentQuestions.length === 0) return;
  // Fisher-Yates shuffle
  for (let i = currentQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentQuestions[i], currentQuestions[j]] = [currentQuestions[j], currentQuestions[i]];
  }
  showQuestions(currentQuestions);
}

/* small helper to escape HTML in questions/options */
function escapeHtml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/* ============================================================= */
/* 🔥 STREAK TRACKER SECTION (FIXED & INTEGRATED) 🔥 */
/* ============================================================= */

const todayDateString = () => new Date().toDateString();
const toYYYYMMDD = (dateObj) => dateObj.toISOString().split('T')[0];

function isYesterday(dateString) {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

function updateBadge(streak, badgeEl) {
    if (streak >= 30) {
      badgeEl.textContent = "🏅 Monthly Master — 30 Day Streak!";
      badgeEl.style.animation = "glowBadge 1.5s infinite alternate";
    } else if (streak >= 7) {
      badgeEl.textContent = "🔥 Weekly Achiever — 7 Day Streak!";
    } else if (streak >= 3) {
      badgeEl.textContent = "⚡ Keep It Going — 3+ Days!";
    } else if (streak > 0) {
      badgeEl.textContent = "💪 Great Start!";
    } else {
      badgeEl.textContent = "";
      badgeEl.style.animation = "none";
    }
}

function markToday() {
  const streakCountEl = document.getElementById("streakCount");
  const badgeEl = document.getElementById("badge");
  
  if (!streakCountEl || !badgeEl) return;

  const today = todayDateString();
  let streak = parseInt(localStorage.getItem("streakCount")) || 0;
  let lastDate = localStorage.getItem("lastMarkedDate");

  if (lastDate === today) {
    // Already marked, do not change streak count or storage
    // Optional: alert("✅ You already marked today!"); 
    return true; // Return true to indicate it's marked
  }

  // If yesterday was last marked, continue streak
  if (lastDate && isYesterday(lastDate)) {
    streak++;
  } else {
    streak = 1; // reset if gap
  }

  localStorage.setItem("streakCount", streak);
  localStorage.setItem("lastMarkedDate", today);

  streakCountEl.textContent = streak;
  updateBadge(streak, badgeEl);
  
  // Also mark in the calendar's storage
  const todayKey = toYYYYMMDD(new Date());
  let markedDates = JSON.parse(localStorage.getItem("markedDates") || "[]");
  if (!markedDates.includes(todayKey)) {
      markedDates.push(todayKey);
      localStorage.setItem("markedDates", JSON.stringify(markedDates));
  }
  
  // Re-render calendar to show new mark
  renderCalendar();
  
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const streakCountEl = document.getElementById("streakCount");
  const badgeEl = document.getElementById("badge");
  const markBtn = document.getElementById("markTodayBtn");

  if (streakCountEl && badgeEl) {
    // Load and display initial streak
    let streak = parseInt(localStorage.getItem("streakCount")) || 0;
    streakCountEl.textContent = streak;
    updateBadge(streak, badgeEl);
  }

  if (markBtn) {
      markBtn.addEventListener("click", () => {
        if(markToday()) {
            alert("✅ Streak marked for today!");
        }
      });
  }
  
  // Initial calendar rendering
  renderCalendar(); 
});


/* =============================================== */
/* 🔥 FIXED LIVE CALENDAR (Top-Right Compact View) 🔥 */
/* =============================================== */

function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  // Clear existing content first
  calendarEl.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayToday = today.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sunday, 1=Monday...

  // 🌙 Add month heading
  const monthTitle = document.createElement("div");
  monthTitle.textContent = today.toLocaleString("default", { month: "long", year: "numeric" });
  monthTitle.style.textAlign = "center";
  monthTitle.style.fontWeight = "600";
  monthTitle.style.marginBottom = "8px";
  monthTitle.style.color = "#ffffff";
  calendarEl.appendChild(monthTitle);
  
  // Days of the week header
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weekHeader = document.createElement("div");
  weekHeader.style.display = "grid";
  weekHeader.style.gridTemplateColumns = "repeat(7, 1fr)";
  weekHeader.style.gap = "4px";
  weekHeader.style.justifyItems = "center";
  weekHeader.style.marginBottom = "4px";
  daysOfWeek.forEach(dayLetter => {
      const headerEl = document.createElement("div");
      headerEl.textContent = dayLetter;
      headerEl.style.fontSize = "11px";
      headerEl.style.color = "#999";
      weekHeader.appendChild(headerEl);
  });
  calendarEl.appendChild(weekHeader);


  // 🗓️ Create grid for days
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(7, 1fr)";
  grid.style.gap = "4px";
  grid.style.justifyItems = "center";
  grid.style.alignItems = "center";
  
  // Add empty slots for the days before the 1st
  for(let i=0; i < firstDayOfMonth; i++) {
      grid.appendChild(document.createElement("div"));
  }

  // Use 'markedDates' array storing 'YYYY-MM-DD' strings
  const markedDates = JSON.parse(localStorage.getItem("markedDates") || "[]");

  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = i;
    
    const dayDate = new Date(year, month, i);
    const dayKey = toYYYYMMDD(dayDate);
    
    // ✅ Style: small circular calendar look
    dayEl.style.width = "24px";
    dayEl.style.height = "24px";
    dayEl.style.display = "flex";
    dayEl.style.justifyContent = "center";
    dayEl.style.alignItems = "center";
    dayEl.style.borderRadius = "50%";
    dayEl.style.cursor = "pointer";
    dayEl.style.fontSize = "12px";
    dayEl.style.color = "#ccc";
    dayEl.style.transition = "all 0.2s ease";

    // check if this day is marked
    const isMarked = markedDates.includes(dayKey);

    if (isMarked) {
      dayEl.classList.add("marked");
      dayEl.style.background = "linear-gradient(135deg, #2b8cff, #00e0ff)";
      dayEl.style.color = "#fff";
    } else {
        dayEl.style.background = "rgba(255, 255, 255, 0.05)";
        dayEl.style.color = "#ccc";
    }

    // highlight today's date
    if (i === dayToday) {
      dayEl.style.border = "1.5px solid #a0d4ff";
      dayEl.style.boxShadow = "0 0 6px rgba(43,140,255,0.3)";
    }
    
    // 🔥 New: Mark today when clicked, but only for today or unmarked future days
    dayEl.addEventListener("click", () => {
        const clickedDate = new Date(year, month, i);
        const todayReset = new Date();
        todayReset.setHours(0,0,0,0);
        
        // Only allow marking today's date to trigger the streak logic
        if (clickedDate.toDateString() === todayReset.toDateString()) {
            // This function handles the streak counter, lastMarkedDate, and updates markedDates storage
            markToday();
        } else if (clickedDate > todayReset) {
            alert("🛑 You can only mark your streak for today or past days, not future ones!");
        } else {
            // Allow manual marking/unmarking of past days on the calendar
            if (dayEl.classList.contains("marked")) {
                dayEl.classList.remove("marked");
                dayEl.style.background = "rgba(255, 255, 255, 0.05)";
                dayEl.style.color = "#ccc";
                const idx = markedDates.indexOf(dayKey);
                if (idx > -1) markedDates.splice(idx, 1);
            } else {
                dayEl.classList.add("marked");
                dayEl.style.background = "linear-gradient(135deg, #2b8cff, #00e0ff)";
                dayEl.style.color = "#fff";
                markedDates.push(dayKey);
            }
            localStorage.setItem("markedDates", JSON.stringify(markedDates));
            // Note: Manually marking past days *does not* affect the streak counter logic.
        }
        
    });

    grid.appendChild(dayEl);
  }

  calendarEl.appendChild(grid);
}

// Ensure initial render is called on DOMContentLoaded (already in the listener block)