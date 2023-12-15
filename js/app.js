//Worker initialization
const worker = new Worker("./js/worker.js", { type: "module" });

// Main Selectors
const question = document.querySelector(".question");
const category = document.querySelector(".category");
const answerBtn = document.querySelector(".check-answer");
const playAgainBtn = document.querySelector(".play-again");
const correctScoreEl = document.querySelector("#correct-answers");
const totalQuestions = document.querySelector("#total-questions");
const submitQuiz = document.querySelector(".submit-quiz");
const submitQuestion = document.querySelector(".submit-question");
const quizSection = document.querySelector(".quiz");
const downloadResults = document.querySelector(".download-results");
const catSection = document.querySelector(".cat-section");
const catImage = document.querySelector(".cat");

// Result Selector
const options = document.querySelector(".options");
const results = document.querySelector(".results");

// Initial Values
let correctAnswer = "";
let correctScore = 0;
let wrongAnswers = 0;
let askedCount = 0;
let currentQuestionIndex = 0;
let questionCount = 0;

// Function to generate cat 
const generateCat = async(count) => {
  try{
    const url = `https://api.thecatapi.com/v1/images/search?limit=${count}`
    const res = await fetch(url, {
      method: "GET",
      // mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        "x-api-key": 'live_qaqiyC55N0DeLZDBYwZUjGtMdhqfdsZapjEmCJXnY0NyCYRdctBTUPnQvVZv4F8a',
      },
    });
    const data = await res.json();
    return data;
  }catch(err){
    console.log(err);
  }
};


// Event Listener to start the quiz
submitQuiz.addEventListener("click", async (e) => {
  e.preventDefault();
  questionCount = document.querySelector("#question-count").value;
  const categorySelect = document.querySelector("#category").value;
  const difficultySelect = document.querySelector("#difficulty").value;

  if (isNaN(questionCount) || questionCount === "" || questionCount < 1) {
    alert("Please enter a number or number bigger than 0");
  } else {
    removeData();
    playAgainBtn.classList.add("hide");

    localStorage.setItem("questionCount", JSON.stringify(questionCount));
    localStorage.setItem("correctAnswers", JSON.stringify(correctScore));
    localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));

    try {
      const data = await getData(
        questionCount,
        categorySelect,
        difficultySelect
      );

      const cats = await generateCat(questionCount);

      localStorage.setItem("questions", JSON.stringify(data.results));
      localStorage.setItem("cats", JSON.stringify(cats));

      currentQuestionIndex = 0;
      localStorage.setItem("currentQuestionIndex", JSON.stringify(currentQuestionIndex));
      quizSection.classList.remove("hide");
      totalQuestions.textContent = questionCount;
      correctScoreEl.textContent = JSON.parse(localStorage.getItem("correctAnswers"));
      answerBtn.classList.remove("hide");
      loadNextQuestion();
    } catch (err) {
      console.log(err);
    }
  }
});

// Function to load next question
const loadNextQuestion = () => {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const cats = JSON.parse(localStorage.getItem("cats"));
  const questionIndex = JSON.parse(localStorage.getItem("currentQuestionIndex"));
  if (questionIndex < questions.length) {
    showQuestions(questions[questionIndex]);
    showCat(cats[questionIndex]);
  }
};

const showResult = () => {
  results.innerHTML += `<p>Quiz Completed. Your score is ${correctScoreEl.textContent}</p>`;
  playAgainBtn.classList.remove("hide");
  answerBtn.classList.add("hide");
};

// Function to fetch data from API
const getData = async (questionCount, categorySelect, difficultySelect) => {
  const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${categorySelect}&difficulty=${difficultySelect}&type=multiple`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Something went wrong");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Function to show cat
const showCat = (data) => {

  const catImage = document.createElement("img");
  catImage.setAttribute("src", data.url);
  catImage.setAttribute("alt", "cat");

  const catSection = document.querySelector(".cat-section");
  catSection.appendChild(catImage);
};

// Function to show questions
const showQuestions = (data) => {
  question.innerHTML = data.question;
  category.innerHTML = data.category;
  correctAnswer = data.correct_answer;
  let incorrect_answers = data.incorrect_answers;
  const answers = [...incorrect_answers, correctAnswer];
  answers.sort(() => Math.random() - 0.5);
  options.innerHTML = "";
  results.innerHTML = "";
  catSection.innerHTML = "";
  answers.forEach((answer) => {
    const li = document.createElement("li");
    li.innerHTML = answer;
    options.appendChild(li);
  });
  selectOption();
};

// Function to select option
function selectOption() {
  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", function () {
      if (options.querySelector(".selected")) {
        const activeOption = options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// Function to check answer
const checkAnswer = () => {
  answerBtn.disabled = true;
  let correct = JSON.parse(localStorage.getItem("correctAnswers"));
  let wrong = JSON.parse(localStorage.getItem("wrongAnswers"));
  let questionIndex = JSON.parse(localStorage.getItem("currentQuestionIndex"));
  questionIndex++;
  if (options.querySelector(".selected")) {
    let selectedAnswer = options.querySelector(".selected").textContent;
    if (selectedAnswer === correctAnswer) {
      correct++;
      correctScoreEl.textContent = correct;
      results.innerHTML = `<p>Correct Answer</p>`;
    } else {
      results.innerHTML = `<p>Wrong Answer. Correct Answer: ${correctAnswer}</p>`;
      wrong++;
    }
    checkCount();
  } else {
    results.innerHTML = `<p>Please select an answer</p>`;
    answerBtn.disabled = false;
  }
  localStorage.setItem("currentQuestionIndex", JSON.stringify(questionIndex));
  localStorage.setItem("correctAnswers", JSON.stringify(correct));
  localStorage.setItem("wrongAnswers", JSON.stringify(wrong));
};

// Function to check count of the asked questions
const checkCount = () => {
  const questionCount = JSON.parse(localStorage.getItem("questionCount"));
  askedCount++;
  if (askedCount < questionCount) {
    setTimeout(() => {
      loadNextQuestion();
      answerBtn.disabled = false;
    }, 1000);
  } else {
    setTimeout(() => {
      showResult();
      answerBtn.disabled = false;
      answerBtn.classList.add("hide");
      playAgainBtn.classList.remove("hide");
      downloadResults.classList.remove("hide");
    }, 1000);
  }
};

answerBtn.addEventListener("click", checkAnswer);

const clearLocalStorage = () => {
  localStorage.removeItem("questions");
  localStorage.removeItem("questionCount");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("cats");
  localStorage.removeItem("wrongAnswers");
  localStorage.removeItem("currentQuestionIndex");
};

playAgainBtn.addEventListener("click", () => {
  removeData();
});

// Function to remove all of the used data
const removeData = () => {
  clearLocalStorage();
  quizSection.classList.add("hide");
  correctAnswer = "";
  correctScore = 0;
  askedCount = 0;
  currentQuestionIndex = 0;
  questionCount;
};

// Function that shows the question if it exists in the localStorage
const showQuestionsIfExist = () => {
  const questions = JSON.parse(localStorage.getItem("questions"));
  if (questions) {
    quizSection.classList.remove("hide");
    totalQuestions.textContent = JSON.parse(localStorage.getItem("questionCount"));
    correctScoreEl.textContent = JSON.parse(localStorage.getItem("correctAnswers"));
    answerBtn.classList.remove("hide");
    loadNextQuestion();
  }
};

showQuestionsIfExist();

downloadResults.addEventListener("click", () => {
  const correctScore = JSON.parse(localStorage.getItem("correctAnswers"));
  const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers"));
  const questionCount = JSON.parse(localStorage.getItem("questionCount"));

  worker.onmessage = (e) => {
    const blob = e.data;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "QuizResults.zip";
    link.click();
  };
  worker.postMessage({ correctScore, wrongAnswers, questionCount });
});

