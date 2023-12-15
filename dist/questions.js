// Selectors
const submitSavedQuestion = document.querySelector(".submit-question");
// Function to add question to local storage
const addQuestion = (category, difficulty, question, correctAnswer, incorrectAnswers) => {
    const existingQuestions = JSON.parse(localStorage.getItem("newQuestion") || "[]");
    const newQuestion = {
        category,
        difficulty,
        question,
        correctAnswer,
        incorrectAnswers,
    };
    existingQuestions.push(newQuestion);
    localStorage.setItem("newQuestion", JSON.stringify(existingQuestions));
};
// Function to collect question input
function collectQuestionInput() {
    var _a, _b, _c, _d, _e, _f, _g;
    const category = (_a = document.querySelector("#category-question")) === null || _a === void 0 ? void 0 : _a.value;
    const difficulty = (_b = document.querySelector("#difficulty-question")) === null || _b === void 0 ? void 0 : _b.value;
    const question = (_c = document.querySelector(".question-input")) === null || _c === void 0 ? void 0 : _c.value;
    const correctAnswer = (_d = document.querySelector(".correct-answer-input")) === null || _d === void 0 ? void 0 : _d.value;
    const incorrectAnswers = [
        (_e = document.querySelector(".incorrect-answer-input-1")) === null || _e === void 0 ? void 0 : _e.value,
        (_f = document.querySelector(".incorrect-answer-input-2")) === null || _f === void 0 ? void 0 : _f.value,
        (_g = document.querySelector(".incorrect-answer-input-3")) === null || _g === void 0 ? void 0 : _g.value,
    ].filter((value) => value !== undefined); // ?????????
    if (!category ||
        !difficulty ||
        !question ||
        !correctAnswer ||
        !incorrectAnswers[0] ||
        !incorrectAnswers[1] ||
        !incorrectAnswers[2]) {
        alert("Please fill in all fields");
        return;
    }
    addQuestion(category, difficulty, question, correctAnswer, incorrectAnswers);
}
// Event listener
submitSavedQuestion === null || submitSavedQuestion === void 0 ? void 0 : submitSavedQuestion.addEventListener("click", (e) => {
    e.preventDefault();
    collectQuestionInput();
    const resetElementContent = (selector) => {
        const element = document.querySelector(selector);
        if (!element)
            return;
        element.value = "";
    };
    resetElementContent(".question-input");
    resetElementContent(".correct-answer-input");
    resetElementContent(".incorrect-answer-input-1");
    resetElementContent(".incorrect-answer-input-2");
    resetElementContent(".incorrect-answer-input-3");
});
export {};
