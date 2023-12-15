// Selectors
const savedCategoryQuestion = document.querySelector("#category-question");
const savedDifficulty = document.querySelector("#difficulty-question");
const savedQuestions = document.querySelector(".question-input");
const savedCorrectAnswer = document.querySelector(".correct-answer-input");
const savedIncorrectAnswer1 = document.querySelector(
  ".incorrect-answer-input-1"
);
const savedIncorrectAnswer2 = document.querySelector(
  ".incorrect-answer-input-2"
);
const savedIncorrectAnswer3 = document.querySelector(
  ".incorrect-answer-input-3"
);
const submitSavedQuestion = document.querySelector(".submit-question");

// Function to add question to local storage
const addQuestion = (
  category,
  difficulty,
  question,
  correctAnswer,
  incorrectAnswers
) => {
  const existingQuestions =
    JSON.parse(localStorage.getItem("newQuestion")) || [];
  const newQuestion = {
    category,
    difficulty,
    question,
    correctAnswer,
    incorrectAnswers,
  };

  existingQuestions.push(newQuestion);
  localStorage.setItem("newQuestion", JSON.stringify(existingQuestions));
  console.log("Question saved successfully!");
};

// Function to collect question input
function collectQuestionInput() {
  const category = document.getElementById("category-question").value;
  const difficulty = document.getElementById("difficulty-question").value;
  const question = document.querySelector(".question-input").value;
  const correctAnswer = document.querySelector(".correct-answer-input").value;
  const incorrectAnswers = [
    document.querySelector(".incorrect-answer-input-1").value,
    document.querySelector(".incorrect-answer-input-2").value,
    document.querySelector(".incorrect-answer-input-3").value,
  ];
  if (
    category === "" ||
    difficulty === "" ||
    question === "" ||
    correctAnswer === "" ||
    incorrectAnswers[0] === "" ||
    incorrectAnswers[1] === "" ||
    incorrectAnswers[2] === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  addQuestion(category, difficulty, question, correctAnswer, incorrectAnswers);
}

// Event listener
submitSavedQuestion.addEventListener("click", (e) => {
  e.preventDefault();

  collectQuestionInput();

  document.querySelector(".question-input").textContent = "";
  document.querySelector(".correct-answer-input").textContent = "";
  document.querySelector(".incorrect-answer-input-1").textContent = "";
  document.querySelector(".incorrect-answer-input-2").textContent = "";
  document.querySelector(".incorrect-answer-input-3").textContent = "";
});
