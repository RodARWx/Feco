export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

export interface Unit {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuestionBank {
  units: Unit[];
}

export interface Attempt {
  id?: number;
  unitId: string;
  date: Date;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  answers: Record<string, string>; // questionId -> optionId
}

export interface QuestionStat {
  id?: number;
  questionId: string;
  unitId: string;
  timesAnswered: number;
  timesCorrect: number;
  lastAttempt: Date;
  nextReviewDate: Date; // For spaced repetition
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: Date | null;
}
