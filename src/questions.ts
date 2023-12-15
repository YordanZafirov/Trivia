import { NewQuestion } from "./models";

// Selectors
const submitSavedQuestion =
  document.querySelector<HTMLButtonElement>(".submit-question");

// Function to add question to local storage
const addQuestion = (
  category: string,
  difficulty: string,
  question: string,
  correctAnswer: string,
  incorrectAnswers: string[]
): void => {
  const existingQuestions: NewQuestion[] = JSON.parse(
    localStorage.getItem("newQuestion") || "[]"
  );
  const newQuestion: NewQuestion = {
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
function collectQuestionInput(): void {
  const category =
    document.querySelector<HTMLInputElement>("#category-question")?.value;
  const difficulty = document.querySelector<HTMLInputElement>(
    "#difficulty-question"
  )?.value;
  const question =
    document.querySelector<HTMLInputElement>(".question-input")?.value;
  const correctAnswer = document.querySelector<HTMLInputElement>(
    ".correct-answer-input"
  )?.value;
  const incorrectAnswers: string[] = [
    document.querySelector<HTMLInputElement>(".incorrect-answer-input-1")
      ?.value,
    document.querySelector<HTMLInputElement>(".incorrect-answer-input-2")
      ?.value,
    document.querySelector<HTMLInputElement>(".incorrect-answer-input-3")
      ?.value,
  ].filter((value): value is string => value !== undefined); // ?????????

  if (
    !category ||
    !difficulty ||
    !question ||
    !correctAnswer ||
    !incorrectAnswers[0] ||
    !incorrectAnswers[1] ||
    !incorrectAnswers[2]
  ) {
    alert("Please fill in all fields");
    return;
  }

    addQuestion(category, difficulty, question, correctAnswer, incorrectAnswers);
}

// Event listener
submitSavedQuestion?.addEventListener("click", (e) => {
  e.preventDefault();

  collectQuestionInput();

  const resetElementContent = (selector: string): void => {
    const element = document.querySelector<HTMLInputElement>(selector);
    if(!element) return;
    element.value = "";
  };

  resetElementContent(".question-input");
  resetElementContent(".correct-answer-input");
  resetElementContent(".incorrect-answer-input-1");
  resetElementContent(".incorrect-answer-input-2");
  resetElementContent(".incorrect-answer-input-3");
});
