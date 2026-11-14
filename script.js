
const missions = [
  {
    title: "Mission Briefing",
    icon: "📡",
    subtitle: "Welcome to astronaut training, Cadet!",
    description: "Every great space journey begins with a plan. Your mission is to learn about space exploration, understand your objectives, and prepare yourself for an exciting adventure beyond Earth.",
    fact: "DID YOU KNOW? Astronauts train for years before travelling into space."
  },
  {
    title: "Spacecraft Preparation",
    icon: "🧑‍🚀",
    subtitle: "Prepare yourself for launch!",
    description: "Astronauts need special equipment to survive in space. A spacesuit supplies oxygen, helps regulate temperature, and protects astronauts. Spacecraft are carefully checked before launch.",
    fact: "DID YOU KNOW? A spacesuit is like a tiny personal spacecraft!"
  },
  {
    title: "Space Navigation",
    icon: "🛰️",
    subtitle: "Navigate the universe!",
    description: "Spacecraft use computers, sensors, communication systems, and carefully planned paths to travel through space. Mission teams on Earth help astronauts and spacecraft navigate safely.",
    fact: "DID YOU KNOW? Signals between Earth and distant spacecraft can take minutes or even hours to travel."
  },
  {
    title: "Planet Exploration",
    icon: "🪐",
    subtitle: "Discover our solar system!",
    description: "Our solar system has eight planets. Some are rocky, while others are giant planets made mostly of gas or ice. Scientists use telescopes, orbiters, and robotic rovers to explore them.",
    fact: "DID YOU KNOW? Jupiter is the largest planet in our solar system."
  },
  {
    title: "Mission Completion",
    icon: "🏆",
    subtitle: "Your final astronaut challenge!",
    description: "You have reached the final training stage. Review what you have learned, complete the space explorer quiz, and earn your achievement badge.",
    fact: "YOUR CHALLENGE: Score at least 4 out of 5 in the quiz to unlock the Space Genius badge."
  }
];

const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Neptune"],
    correct: 1,
    explanation: "Correct! Mars looks reddish because of iron-rich dust on its surface."
  },
  {
    question: "How many planets are in our solar system?",
    answers: ["Seven", "Eight", "Nine", "Ten"],
    correct: 1,
    explanation: "Correct! Our solar system has eight recognized planets."
  },
  {
    question: "Which planet is the largest?",
    answers: ["Earth", "Saturn", "Jupiter", "Mercury"],
    correct: 2,
    explanation: "Correct! Jupiter is the largest planet in our solar system."
  },
  {
    question: "What do astronauts wear to protect themselves in space?",
    answers: ["Raincoat", "Spacesuit", "Winter jacket", "Uniform only"],
    correct: 1,
    explanation: "Correct! Spacesuits provide protection and life-support systems."
  },
  {
    question: "Which star is closest to Earth?",
    answers: ["Sirius", "Polaris", "The Sun", "Vega"],
    correct: 2,
    explanation: "Correct! The Sun is the closest star to Earth."
  }
];

const completed = new Set();
let currentMission = null;
let questionIndex = 0;
let score = 0;
let answered = false;

const missionPanel = document.getElementById("missionPanel");
const panelNumber = document.getElementById("panelNumber");
const panelTitle = document.getElementById("panelTitle");
const panelIcon = document.getElementById("panelIcon");
const panelSubtitle = document.getElementById("panelSubtitle");
const panelDescription = document.getElementById("panelDescription");
const panelFact = document.getElementById("panelFact");

function updateProgress() {
  const count = completed.size;
  document.getElementById("progressCount").textContent = count;
  document.getElementById("progressFill").style.width = `${count * 20}%`;

  missions.forEach((mission, index) => {
    const card = document.querySelectorAll(".mission-card")[index];
    const status = document.getElementById(`status${index}`);
    const button = document.querySelector(`[data-mission="${index}"]`);

    if (completed.has(index)) {
      card.classList.add("done");
      status.textContent = "✓ COMPLETED";
      button.textContent = "REPLAY MISSION ↻";
    } else {
      card.classList.remove("done");
      status.textContent = "NOT STARTED";
      button.textContent = "START MISSION →";
    }
  });

  if (count >= 1) {
    document.getElementById("badgeFirst").classList.add("unlocked");
    document.querySelector("#badgeFirst em").textContent = "UNLOCKED ✓";
  }

  if (count === 5) {
    document.getElementById("badgeExplorer").classList.add("unlocked");
    document.querySelector("#badgeExplorer em").textContent = "UNLOCKED ✓";
  }
}

function openMission(index) {
  currentMission = index;
  const mission = missions[index];

  panelNumber.textContent = `MISSION 0${index + 1}`;
  panelTitle.textContent = mission.title;
  panelIcon.textContent = mission.icon;
  panelSubtitle.textContent = mission.subtitle;
  panelDescription.textContent = mission.description;
  panelFact.textContent = mission.fact;

  const completeButton = document.getElementById("completeMission");

  if (completed.has(index)) {
    completeButton.textContent = "MISSION ALREADY COMPLETED ✓";
  } else {
    completeButton.textContent = "COMPLETE MISSION ✓";
  }

  missionPanel.hidden = false;
  missionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll(".mission-button").forEach(button => {
  button.addEventListener("click", () => {
    openMission(Number(button.dataset.mission));
  });
});

document.getElementById("beginButton").addEventListener("click", () => {
  document.getElementById("training").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("closePanel").addEventListener("click", () => {
  missionPanel.hidden = true;
});

document.getElementById("completeMission").addEventListener("click", () => {
  if (currentMission === null) return;

  if (!completed.has(currentMission)) {
    completed.add(currentMission);
    updateProgress();

    document.getElementById("completeMission").textContent =
      "MISSION COMPLETED ✓";

    document.getElementById("panelFact").textContent =
      "Great work, Cadet! Your mission has been added to your training record.";
  }
});

function showQuestion() {
  answered = false;

  const question = questions[questionIndex];

  document.getElementById("questionNumber").textContent =
    `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  document.getElementById("quizScore").textContent = `SCORE: ${score}`;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("quizFeedback").textContent = "";

  const answerList = document.getElementById("answerList");
  answerList.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.textContent = answer;

    button.addEventListener("click", () => selectAnswer(index, button));

    answerList.appendChild(button);
  });

  document.getElementById("nextQuestion").disabled = true;
  document.getElementById("nextQuestion").textContent =
    questionIndex === questions.length - 1
      ? "SEE MY RESULTS →"
      : "NEXT QUESTION →";

  document.getElementById("quizResult").hidden = true;
}

function selectAnswer(selectedIndex, selectedButton) {
  if (answered) return;

  answered = true;

  const question = questions[questionIndex];
  const options = document.querySelectorAll(".answer-option");

  options.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add("correct");
    }
  });

  if (selectedIndex === question.correct) {
    score++;
    selectedButton.classList.add("correct");
    document.getElementById("quizFeedback").textContent =
      "✓ " + question.explanation;
  } else {
    selectedButton.classList.add("wrong");
    document.getElementById("quizFeedback").textContent =
      "Not quite! " + question.explanation;
  }

  document.getElementById("quizScore").textContent = `SCORE: ${score}`;
  document.getElementById("nextQuestion").disabled = false;
}

document.getElementById("nextQuestion").addEventListener("click", () => {
  if (!answered) return;

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  document.getElementById("questionNumber").textContent = "QUIZ COMPLETED";
  document.getElementById("questionText").textContent = "Your mission results!";
  document.getElementById("answerList").innerHTML = "";
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("nextQuestion").hidden = true;

  const result = document.getElementById("quizResult");
  result.hidden = false;

  if (score >= 4) {
    result.textContent = `🏆 Excellent work, Cadet! You scored ${score}/5 and unlocked Space Genius!`;
    document.getElementById("badgeGenius").classList.add("unlocked");
    document.querySelector("#badgeGenius em").textContent = "UNLOCKED ✓";
  } else {
    result.textContent = `⭐ You scored ${score}/5. Keep learning and try again to earn your Space Genius badge!`;
  }

  const retryButton = document.createElement("button");
  retryButton.className = "primary-button";
  retryButton.textContent = "TRY AGAIN ↻";
  retryButton.style.marginTop = "15px";

  retryButton.addEventListener("click", resetQuiz);
  result.appendChild(document.createElement("br"));
  result.appendChild(retryButton);
}

function resetQuiz() {
  questionIndex = 0;
  score = 0;
  answered = false;

  document.getElementById("nextQuestion").hidden = false;
  document.getElementById("badgeGenius").classList.remove("unlocked");
  document.querySelector("#badgeGenius em").textContent = "LOCKED";

  showQuestion();
}

updateProgress();
showQuestion();
