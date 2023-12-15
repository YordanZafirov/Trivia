# Quiz Application Readme

This readme file provides instructions on how to use the Quiz Application, including information about the APIs used (Open Trivia and The Cat API), how to run the project, and details on application functionality.

## Application Overview

The Quiz Application allows users to create quizzes by specifying the number of questions, category, and difficulty. The user is presented with a quiz card containing a question, its category, and multiple-choice answers. After selecting an answer, the user can check its correctness. A cat photo or gif is displayed at the bottom of each card for added enjoyment.

The application keeps track of the user's score, showing the number of correct answers and the total number of questions. At the end of the quiz, users can choose to play again or download their quiz results, which are saved in a zip file containing a text file with detailed statistics.

Additionally, users can create and save custom questions with category, difficulty, question, correct answer, and three wrong answers. These custom questions are stored locally.

## How to Use the Application

### 1. Launch the Application:
- Clone the repository.
- Open the 'index.html' file in a web browser.

### 2. Start a Quiz:
- Input the desired number of questions, category, and difficulty.
- Click the "Start Quiz" button.

### 3. Answer Questions:
- Read each quiz card, select an answer, and check correctness.
- Cat photos or gifs will be displayed at the bottom of each card.

### 4. Track Progress:
- The application tracks the user's score throughout the quiz.

### 5. End of Quiz:
- At the end of the quiz, choose to play again or download results.

### 6. Download Results:
- Click the "Download Results" button.
- A zip file containing a text file with quiz statistics will be downloaded.

### 7. Submit Custom Questions:
- Navigate to the "Submit Question" section.
- Provide category, difficulty, question, correct answer, and three wrong answers.
- Click the "Submit Question" button.

### 8. Play Again: 
- Choose to play another quiz by configuring the number of questions, category, and difficulty.

## APIs Used

### 1. Open Trivia API:
- Used for retrieving quiz questions based on user input.

### 2. The Cat API:
- Provides cat photos or gifs for a delightful user experience.


## Local Storage
- Custom questions created by users are stored in the local storage for future access.

## Running the Project
- No special steps are required to run the project. Simply open the 'index.html' file in a web browser.

## Additional Notes
- The application uses local storage for storing custom questions and keeping track of your answers. Ensure that local storage is enabled in your browser.