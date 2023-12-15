var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//https://opentdb.com/api.php?amount=10&encode=base64
//направи true/false state за свършена игра или за състояние на играта (set-up, in game, finished)
//накрая скрийй и формите като се пусне въпрос
//Worker initialization
const worker = new Worker("worker.js", { type: "module" });
// Main Selectors
const question = document.querySelector(".question");
const category = document.querySelector(".category");
const answerBtn = document.querySelector(".check-answer");
const playAgainBtn = document.querySelector(".play-again");
const correctScoreEl = document.querySelector("#correct-answers");
const totalQuestions = document.querySelector("#total-questions");
const submitQuiz = document.querySelector(".submit-quiz");
const quizSection = document.querySelector(".quiz");
const downloadResults = document.querySelector(".download-results");
const catSection = document.querySelector(".cat-section");
// Result Selector
const options = document.querySelector(".options");
const results = document.querySelector(".results");
// Initial Values
let correctAnswer = "";
let correctScore = 0;
let wrongAnswers = 0;
let askedCount = 0;
let currentQuestionIndex = 0;
const getItem = (key) => {
    switch (key) {
        case "questionCount": {
            const data = localStorage.getItem(key);
            return parseInt(data || "0");
        }
        case "wrongAnswers": {
            const data = localStorage.getItem(key);
            return parseInt(data || "0");
        }
        case "correctAnswers": {
            const data = localStorage.getItem(key);
            return parseInt(data || "0");
        }
        case "currentQuestionIndex": {
            const data = localStorage.getItem(key);
            return parseInt(data || "0");
        }
        case "questions": {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }
        case "cats": {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }
        case "askedCount": {
            const data = localStorage.getItem(key);
            return parseInt(data || "0");
        }
        default: {
            throw new Error(`Unexpected key: ${key}`);
        }
    }
};
// Function to generate cat
const generateCat = (count) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
        const res = yield fetch(url, {
            method: "GET",
            // mode: "cors", // no-cors, *cors, same-origin
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "live_qaqiyC55N0DeLZDBYwZUjGtMdhqfdsZapjEmCJXnY0NyCYRdctBTUPnQvVZv4F8a",
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch cat data");
        }
        const data = yield res.json();
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
// Event Listener to start the quiz
submitQuiz === null || submitQuiz === void 0 ? void 0 : submitQuiz.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const questionCountInput = document.querySelector("#question-count");
    const categorySelect = document.querySelector("#category");
    const difficultySelect = document.querySelector("#difficulty");
    if (!questionCountInput || !categorySelect || !difficultySelect)
        return;
    const questionCount = parseInt(questionCountInput.value, 10);
    if (isNaN(questionCount) || questionCount < 1) {
        alert("Please enter a valid number greater than 0");
    }
    else {
        removeData();
        playAgainBtn === null || playAgainBtn === void 0 ? void 0 : playAgainBtn.classList.add("hide");
        localStorage.setItem("questionCount", JSON.stringify(questionCount));
        localStorage.setItem("correctAnswers", JSON.stringify(correctScore));
        localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
        localStorage.setItem("askedCount", JSON.stringify(askedCount));
        try {
            const data = yield getData(questionCount, categorySelect.value, difficultySelect.value);
            const cats = yield generateCat(questionCount);
            localStorage.setItem("questions", JSON.stringify(data.results));
            localStorage.setItem("cats", JSON.stringify(cats));
            currentQuestionIndex = 0;
            localStorage.setItem("currentQuestionIndex", JSON.stringify(currentQuestionIndex));
            if (!quizSection ||
                !totalQuestions ||
                !correctScoreEl ||
                !answerBtn ||
                !downloadResults)
                return;
            quizSection === null || quizSection === void 0 ? void 0 : quizSection.classList.remove("hide");
            totalQuestions.textContent = questionCount.toString();
            const askedCountStored = getItem("askedCount");
            correctScoreEl.textContent =
                askedCountStored >= data.results.length
                    ? data.results.length.toString()
                    : `${askedCountStored + 1}`;
            answerBtn === null || answerBtn === void 0 ? void 0 : answerBtn.classList.remove("hide");
            downloadResults.classList.add("hide");
            loadNextQuestion();
        }
        catch (err) {
            console.log(err);
        }
    }
    questionCountInput.value = "";
}));
// Function to load next question
const loadNextQuestion = () => {
    const questions = getItem("questions");
    const cats = getItem("cats");
    const questionIndex = getItem("currentQuestionIndex");
    const askedCountStored = getItem("askedCount");
    if (!correctScoreEl)
        return;
    correctScoreEl.textContent =
        askedCountStored >= questions.length
            ? questions.length.toString()
            : `${askedCountStored + 1}`;
    if (questionIndex < questions.length) {
        showQuestions(questions[questionIndex], cats[questionIndex]);
    }
    else {
        showResult();
    }
};
const showResult = () => {
    const correct = getItem("correctAnswers");
    if (!results || !answerBtn || !playAgainBtn)
        return;
    results.innerHTML += `<p>Quiz Completed. Your score is ${correct}</p>`;
    playAgainBtn.classList.remove("hide");
    answerBtn.classList.add("hide");
};
// Function to fetch data from API
const getData = (questionCount, categorySelect, difficultySelect) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${categorySelect}&difficulty=${difficultySelect}&type=multiple`;
    try {
        const res = yield fetch(url);
        if (!res.ok)
            throw new Error("Something went wrong");
        const data = yield res.json();
        return {
            results: data.results.map((result) => (Object.assign(Object.assign({}, result), { id: crypto.randomUUID() }))),
        };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
//Function to show cat
const showCat = (data) => {
    const catImage = document.createElement("img");
    catImage.setAttribute("src", data.url);
    catImage.setAttribute("alt", "cat");
    const catSection = document.querySelector(".cat-section");
    if (catSection) {
        catSection.appendChild(catImage);
    }
};
// Function to show questions
const showQuestions = (data, catData) => {
    if (!question || !category)
        return;
    question.innerHTML = data.question;
    question.setAttribute("data-id", data.id);
    category.innerHTML = data.category;
    correctAnswer = data.correct_answer;
    const incorrectAnswers = data.incorrect_answers;
    const answers = [...incorrectAnswers, correctAnswer];
    answers.sort(() => Math.random() - 0.5);
    if (options && results && catSection) {
        options.innerHTML = "";
        results.innerHTML = "";
        catSection.innerHTML = "";
    }
    answers.forEach((answer) => {
        const li = document.createElement("li");
        li.innerHTML = answer;
        options === null || options === void 0 ? void 0 : options.appendChild(li);
    });
    showCat(catData);
    selectOption();
};
// Function to select option
function selectOption() {
    options === null || options === void 0 ? void 0 : options.querySelectorAll("li").forEach((option) => {
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
    var _a;
    if (!results || !options || !answerBtn)
        return;
    answerBtn.disabled = true;
    let correct = getItem("correctAnswers");
    let wrong = getItem("wrongAnswers");
    let questionIndex = getItem("currentQuestionIndex");
    let questionId = (_a = document
        .querySelector(".question")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
    console.log(questionId);
    const question = getItem("questions").find((question) => question.id === questionId);
    console.log(question);
    questionIndex++;
    const selectedOption = options.querySelector(".selected");
    if (selectedOption) {
        let selectedAnswer = selectedOption.textContent;
        if (selectedAnswer === correctAnswer) {
            correct++;
            results.innerHTML = `<p>Correct Answer</p>`;
        }
        else {
            results.innerHTML = `<p>Wrong Answer. Correct Answer: ${correctAnswer}</p>`;
            wrong++;
        }
        checkCount();
    }
    else {
        results.innerHTML = `<p>Please select an answer</p>`;
        answerBtn.disabled = false;
    }
    localStorage.setItem("currentQuestionIndex", JSON.stringify(questionIndex));
    localStorage.setItem("correctAnswers", JSON.stringify(correct));
    localStorage.setItem("wrongAnswers", JSON.stringify(wrong));
};
// Function to check count of the asked questions
const checkCount = () => {
    const questionCount = getItem("questionCount");
    askedCount++;
    localStorage.setItem("askedCount", JSON.stringify(askedCount));
    if (askedCount < questionCount) {
        setTimeout(() => {
            loadNextQuestion();
            if (!answerBtn)
                return;
            answerBtn.disabled = false;
        }, 1000);
    }
    else {
        setTimeout(() => {
            showResult();
            if (!answerBtn || !playAgainBtn || !downloadResults)
                return;
            answerBtn.disabled = false;
            answerBtn.classList.add("hide");
            playAgainBtn.classList.remove("hide");
            downloadResults.classList.remove("hide");
        }, 1000);
    }
};
answerBtn === null || answerBtn === void 0 ? void 0 : answerBtn.addEventListener("click", checkAnswer);
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
playAgainBtn === null || playAgainBtn === void 0 ? void 0 : playAgainBtn.addEventListener("click", () => {
    removeData();
});
// Function to remove all of the used data
const removeData = () => {
    clearLocalStorage();
    quizSection === null || quizSection === void 0 ? void 0 : quizSection.classList.add("hide");
    const questionCountInput = document.querySelector("#question-count");
    if (!questionCountInput)
        return;
    questionCountInput.value = "";
    correctAnswer = "";
    correctScore = 0;
    askedCount = 0;
    currentQuestionIndex = 0;
};
// Function that shows the question if it exists in the localStorage
const showQuestionsIfExist = () => {
    const questions = getItem("questions");
    if (questions.length > 0) {
        quizSection === null || quizSection === void 0 ? void 0 : quizSection.classList.remove("hide");
        const questionCount = getItem("questionCount");
        if (!totalQuestions || !correctScoreEl || !answerBtn)
            return;
        totalQuestions.textContent = questionCount.toString();
        const askedCountStored = getItem("askedCount");
        correctScoreEl.textContent =
            askedCountStored >= questions.length
                ? questions.length.toString()
                : `${askedCountStored + 1}`;
        const currentQuestionIndex = getItem("currentQuestionIndex");
        askedCount = currentQuestionIndex;
        answerBtn.classList.remove("hide");
        loadNextQuestion();
    }
};
showQuestionsIfExist();
downloadResults === null || downloadResults === void 0 ? void 0 : downloadResults.addEventListener("click", () => {
    console.log("clicked");
    const correctScore = getItem("correctAnswers");
    const wrongAnswers = getItem("wrongAnswers");
    const questionCount = getItem("questionCount");
    worker.onmessage = (e) => {
        const blob = e.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "QuizResults.zip";
        link.click();
    };
    worker.postMessage({ correctScore, wrongAnswers, questionCount });
});
export {};
