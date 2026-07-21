import Dexie, { type Table } from 'dexie';
import type { Attempt, QuestionStat } from '../types';

export class QuizDatabase extends Dexie {
  attempts!: Table<Attempt, number>;
  questionStats!: Table<QuestionStat, number>;

  constructor() {
    super('QuizAppDB');
    this.version(1).stores({
      attempts: '++id, unitId, date', // Primary key and indexed props
      questionStats: '++id, questionId, unitId, nextReviewDate', 
    });
  }
}

export const db = new QuizDatabase();
