export interface User {
  uid: string;
  email: string;
  displayName: string;
  grade: string;
  subjectsOfInterest: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: {
    english: string;
    urdu: string;
  };
  hint: {
    english: string;
    urdu: string;
  };
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  isComplete: boolean;
  timeRemaining: number;
  startTime: number;
}

export interface QuizSettings {
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit?: number; // in minutes
  language: 'english' | 'urdu';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  questionsWithAnswers: {
    question: Question;
    userAnswer: number | null;
    isCorrect: boolean;
  }[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  questions: Question[];
  answers: number[];
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  subject: string;
  topic: string;
}

export interface UserProgress {
  userId: string;
  subject: string;
  topic: string;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore: number;
  averageTimePerQuestion: number;
  weakAreas: string[];
  lastAttemptDate: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionHistory {
  id: string;
  userId: string;
  questionId: string;
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  attemptedAt: Date;
}

export interface LearningPath {
  userId: string;
  subject: string;
  recommendedTopics: string[];
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  weakAreas: string[];
  nextSteps: string[];
  lastUpdated: Date;
}
