async function loadQuestions() {
  const subject = document.getElementById("subjectSelect").value;
  const level = document.getElementById("levelSelect").value;
  const filePath = `data/${subject}_${level}.json`;

  try {
    const response = await fetch(filePath);
    const questions = await response.json();
    showQuestions(questions);
  } catch (error) {
    document.getElementById("quizContainer").innerHTML =
      `<p style='color:red;'>Error loading questions. File not found: ${filePath}</p>`;
  }
}

function showQuestions(questions) {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
      <h3>${index + 1}. ${q.question}</h3>
      ${q.options
        .map(
          (opt) =>
            `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`
        )
        .join("")}
      <hr>
    `;
    container.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.onclick = () => checkAnswers(questions);
  container.appendChild(submitBtn);
}

function checkAnswers(questions) {
  let score = 0;
  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) {
      score++;
    }
  });
  alert(`✅ Your score: ${score} / ${questions.length}`);
}
