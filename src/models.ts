export interface CatApiResponse {
  breeds: string[];
  height: number;
  id: string;
  url: string;
  width: number;
}

export interface CatData {
  url: string;
}

export interface Questions {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
  id: string;
}

export interface OpenTDBApiResponse {
  results: Questions[];
}

export interface NewQuestion {
  category: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}
