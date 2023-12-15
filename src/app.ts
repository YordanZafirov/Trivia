import {
  CatApiResponse,
  CatData,
  Questions,
  OpenTDBApiResponse,
} from "./models";

//https://opentdb.com/api.php?amount=10&encode=base64
//направи true/false state за свършена игра или за състояние на играта (set-up, in game, finished)
//накрая скрийй и формите като се пусне въпрос

//Worker initialization
const worker = new Worker("worker.js", { type: "module" });

// Main Selectors
const question = document.querySelector<HTMLDivElement>(".question"); // BRAVO for using <T>
const category = document.querySelector<HTMLDivElement>(".category");
const answerBtn = document.querySelector<HTMLButtonElement>(".check-answer");
const playAgainBtn = document.querySelector<HTMLButtonElement>(".play-again");
const correctScoreEl =
  document.querySelector<HTMLSpanElement>("#correct-answers");
const totalQuestions =
  document.querySelector<HTMLSpanElement>("#total-questions");
const submitQuiz = document.querySelector<HTMLButtonElement>(".submit-quiz");
const quizSection = document.querySelector<HTMLDivElement>(".quiz");
const downloadResults =
  document.querySelector<HTMLButtonElement>(".download-results");
const catSection = document.querySelector<HTMLDivElement>(".cat-section");

// Result Selector
const options = document.querySelector<HTMLUListElement>(".options");
const results = document.querySelector<HTMLDivElement>(".results");

// Initial Values
let correctAnswer = "";
let correctScore = 0;
let wrongAnswers = 0;
let askedCount = 0;
let currentQuestionIndex = 0;

const getItem = (
  key:
    | "questionCount"
    | "correctAnswers"
    | "wrongAnswers"
    | "currentQuestionIndex"
    | "questions"
    | "cats"
    | "askedCount" // I like this
) => {
  const data = localStorage.getItem(key);
  switch (key) {
    case "questionCount": {
      return parseInt(data || "0");
    }
    case "wrongAnswers": {
      return parseInt(data || "0");
    }
    case "correctAnswers": {
      return parseInt(data || "0");
    }
    case "currentQuestionIndex": {
      return parseInt(data || "0");
    }
    case "questions": {
      return data ? JSON.parse(data) : [];
    }
    case "cats": {
      return data ? JSON.parse(data) : [];
    }
    case "askedCount": {
      return parseInt(data || "0");
    }
    default: {
      throw new Error(`Unexpected key: ${key}`);
    }
  }
};

// Function to generate cat
const generateCat = async (count: number): Promise<CatApiResponse[]> => {
  try {
    const url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
    const res = await fetch(url, {
      method: "GET",
      // mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "live_qaqiyC55N0DeLZDBYwZUjGtMdhqfdsZapjEmCJXnY0NyCYRdctBTUPnQvVZv4F8a",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cat data");
    }

    const data: CatApiResponse[] = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Event Listener to start the quiz
submitQuiz?.addEventListener("click", async (e) => {
  e.preventDefault();

  const questionCountInput =
    document.querySelector<HTMLInputElement>("#question-count");
  const categorySelect = document.querySelector<HTMLSelectElement>("#category");
  const difficultySelect =
    document.querySelector<HTMLSelectElement>("#difficulty");

  if (!questionCountInput || !categorySelect || !difficultySelect) return;
  const questionCount = parseInt(questionCountInput.value, 10);

  if (isNaN(questionCount) || questionCount < 1) {
    alert("Please enter a valid number greater than 0");
  } else {
    removeData();
    playAgainBtn?.classList.add("hide");

    localStorage.setItem("questionCount", JSON.stringify(questionCount));
    localStorage.setItem("correctAnswers", JSON.stringify(correctScore));
    localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
    localStorage.setItem("askedCount", JSON.stringify(askedCount));

    try {
      const data = await getData(
        questionCount,
        categorySelect.value,
        difficultySelect.value
      );
      const cats = await generateCat(questionCount);

      localStorage.setItem("questions", JSON.stringify(data.results));
      localStorage.setItem("cats", JSON.stringify(cats));

      currentQuestionIndex = 0;
      localStorage.setItem(
        "currentQuestionIndex",
        JSON.stringify(currentQuestionIndex)
      );
      if (
        !quizSection ||
        !totalQuestions ||
        !correctScoreEl ||
        !answerBtn ||
        !downloadResults
      )
        return;
      quizSection?.classList.remove("hide");
      totalQuestions.textContent = questionCount.toString();
      const askedCountStored: number = getItem("askedCount");
      correctScoreEl.textContent =
        askedCountStored >= data.results.length
          ? data.results.length.toString()
          : `${askedCountStored + 1}`;
      answerBtn?.classList.remove("hide");
      downloadResults.classList.add("hide");
      loadNextQuestion();
    } catch (err) {
      console.log(err);
    }
  }
  questionCountInput.value = "";
});

// Function to load next question
const loadNextQuestion = () => {
  const questions: Questions[] = getItem("questions");
  const cats: CatData[] = getItem("cats");
  const questionIndex: number = getItem("currentQuestionIndex");
  const askedCountStored: number = getItem("askedCount");

  if (!correctScoreEl) return;
  correctScoreEl.textContent =
    askedCountStored >= questions.length
      ? questions.length.toString()
      : `${askedCountStored + 1}`;

  if (questionIndex < questions.length) {
    showQuestions(questions[questionIndex], cats[questionIndex]);
  } else {
    showResult();
  }
};

const showResult = () => {
  const correct: number = getItem("correctAnswers");
  if (!results || !answerBtn || !playAgainBtn) return;
  results.innerHTML += `<p>Quiz Completed. Your score is ${correct}</p>`;
  playAgainBtn.classList.remove("hide");
  answerBtn.classList.add("hide");
};

// Function to fetch data from API
const getData = async (
  questionCount: number,
  categorySelect: string,
  difficultySelect: string
): Promise<OpenTDBApiResponse> => {
  const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${categorySelect}&difficulty=${difficultySelect}&type=multiple`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Something went wrong");
    const data: OpenTDBApiResponse = await res.json();
    return {
      results: data.results.map((result: Questions) => ({
        ...result,
        id: crypto.randomUUID(),
      })),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Function to show cat
const showCat = (data: CatData) => {
  const catImage = document.createElement("img");
  catImage.setAttribute("src", data.url);
  catImage.setAttribute("alt", "cat");

  const catSection = document.querySelector(".cat-section");
  if (catSection) {
    catSection.appendChild(catImage);
  }
};
// Function to show questions
const showQuestions = (data: Questions, catData: CatData) => {
  if (!question || !category) return;
  question.innerHTML = data.question;
  question.setAttribute("data-id", data.id);
  category.innerHTML = data.category;
  correctAnswer = data.correct_answer;

  const incorrectAnswers = data.incorrect_answers;
  const answers: string[] = [...incorrectAnswers, correctAnswer];
  answers.sort(() => Math.random() - 0.5);

  if (options && results && catSection) {
    options.innerHTML = "";
    results.innerHTML = "";
    catSection.innerHTML = "";
  }

  answers.forEach((answer) => {
    const li = document.createElement("li");
    li.innerHTML = answer;
    options?.appendChild(li);
  });

  showCat(catData);
  selectOption();
};

// Function to select option
function selectOption() {
  options?.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", function () {
      const activeOption = options.querySelector(".selected");
      if (activeOption) {
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// Function to check answer
const checkAnswer = () => {
  if (!results || !options || !answerBtn) return;
  answerBtn.disabled = true;

  let correct: number = getItem("correctAnswers");
  let wrong: number = getItem("wrongAnswers");
  let questionIndex: number = getItem("currentQuestionIndex");
  let questionId = document
    .querySelector<HTMLDivElement>(".question")
    ?.getAttribute("data-id");
  console.log(questionId);
  const question = getItem("questions").find(
    ({id}: Questions) => id === questionId // TIP: cleaner code
  );
  console.log(question);

  questionIndex++;

  const selectedOption = options.querySelector(".selected");

  if (selectedOption) {
    let selectedAnswer = selectedOption.textContent;
    if (selectedAnswer === correctAnswer) {
      correct++;

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
  const questionCount: number = getItem("questionCount");
  askedCount++;
  localStorage.setItem("askedCount", JSON.stringify(askedCount));
  if (askedCount < questionCount) {
    setTimeout(() => {
      loadNextQuestion();
      if (!answerBtn) return;
      answerBtn.disabled = false;
    }, 1000);
  } else {
    setTimeout(() => {
      showResult();
      if (!answerBtn || !playAgainBtn || !downloadResults) return;
      answerBtn.disabled = false;
      answerBtn.classList.add("hide");
      playAgainBtn.classList.remove("hide");
      downloadResults.classList.remove("hide");
    }, 1000);
  }
};

answerBtn?.addEventListener("click", checkAnswer);

const clearLocalStorage = () => {
  const keysToRemove = [
    "questions",
    "questionCount",
    "correctAnswers",
    "cats",
    "wrongAnswers",
    "currentQuestionIndex",
    "askedCount",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
};

playAgainBtn?.addEventListener("click", () => {
  removeData();
});

// Function to remove all of the used data
const removeData = () => {
  clearLocalStorage();
  quizSection?.classList.add("hide");
  const questionCountInput =
    document.querySelector<HTMLInputElement>("#question-count");
  if (!questionCountInput) return;
  questionCountInput.value = "";
  correctAnswer = "";
  correctScore = 0;
  askedCount = 0;
  currentQuestionIndex = 0;
};

// Function that shows the question if it exists in the localStorage
const showQuestionsIfExist = () => {
  const questions: Questions[] = getItem("questions");

  if (questions.length > 0) {
    quizSection?.classList.remove("hide");

    const questionCount: number = getItem("questionCount");

    if (!totalQuestions || !correctScoreEl || !answerBtn) return;
    totalQuestions.textContent = questionCount.toString();

    const askedCountStored: number = getItem("askedCount");
    correctScoreEl.textContent =
      askedCountStored >= questions.length
        ? questions.length.toString()
        : `${askedCountStored + 1}`;

    const currentQuestionIndex: number = getItem("currentQuestionIndex");
    askedCount = currentQuestionIndex;

    answerBtn.classList.remove("hide");
    loadNextQuestion();
  }
};

showQuestionsIfExist();
// https://stackoverflow.com/questions/7498361/defining-and-calling-function-in-one-step

downloadResults?.addEventListener("click", () => {
  console.log("clicked");

  const correctScore: number = getItem("correctAnswers");
  const wrongAnswers: number = getItem("wrongAnswers");
  const questionCount: number = getItem("questionCount");

  worker.onmessage = (e) => {
    const blob = e.data;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "QuizResults.zip";
    link.click();
  };
  worker.postMessage({ correctScore, wrongAnswers, questionCount });
});

// Suggestion: declare functions added as Listeners separately and pass them as parameters
