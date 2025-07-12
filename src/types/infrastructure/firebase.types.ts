// =====================================================
// 📁 types/infrastructure/firebase.types.ts
// SOLO tipi Firebase essenziali - Niente astrazioni
// =====================================================

import { Timestamp } from 'firebase/firestore';

/**
 * Query Firestore - Per costruire query dinamiche
 */
export interface FirebaseQuery {
  field: string;
  operator: FirebaseOperator;
  value: any;
}

export type FirebaseOperator = 
  | '==' | '!=' 
  | '<' | '<=' | '>' | '>='
  | 'array-contains' | 'array-contains-any'
  | 'in' | 'not-in';

/**
 * Ordinamento Firestore
 */
export interface FirebaseOrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Paginazione Firestore
 */
export interface FirebasePagination {
  limit: number;
  startAfter?: any;             // DocumentSnapshot
  endBefore?: any;              // DocumentSnapshot
}

/**
 * Documento Word come salvato in Firestore
 */
export interface FirebaseWordDocument {
  id: string;
  english: string;
  italian: string;
  group: string;                // Category enum → string
  chapter: string;
  sentences: string[];          // TUA RICHIESTA
  synonyms: string[];           // TUA RICHIESTA  
  antonyms: string[];           // TUA RICHIESTA
  notes?: string;
  learned: boolean;
  difficult: boolean;
  timesShown: number;
  timesCorrect: number;
  timesIncorrect: number;
  averageResponseTime: number;
  lastShown?: Timestamp;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Documento Test come salvato in Firestore  
 */
export interface FirebaseTestDocument {
  id: string;
  userId: string;
  timestamp: Timestamp;
  testType: string;             // TestType enum → string
  selectedChapters: string[];
  includeLearnedWords: boolean;
  includeDifficultWords: boolean;
  maxWords?: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  totalTime: number;
  avgTimePerWord: number;
  percentage: number;
  difficulty: string;           // Difficulty enum → string
  hitsUsed: number;
  wrongWords: FirebaseTestWordResult[];
  rightWords: FirebaseTestWordResult[];
  chapterStats?: Record<string, any>;
  difficultyAnalysis?: any;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Risultato parola test in Firestore
 */
export interface FirebaseTestWordResult {
  wordId: string;
  isCorrect: boolean;
  timeResponse: number;
  hintsUsed: number;
  currentDifficulty: string;
  wordText?: string;
  translationText?: string;
  chapter?: string;
  userAnswer?: string;
}

/**
 * Documento Stats come salvato in Firestore
 */
export interface FirebaseStatsDocument {
  id: string;
  userId: string;
  totalTests: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  totalTimeSpent: number;
  accuracyRate: number;
  hintsRate: number;
  avgTimePerTest: number;
  avgTimePerWord: number;
  currentStreak: number;
  bestStreak: number;
  consecutiveDays: number;
  dailyProgress: Record<string, any>;
  weeklyStats: any[];
  monthlyStats: any[];
  firstTestDate?: Timestamp;
  lastTestDate?: Timestamp;
  lastActive?: Timestamp;
  migrated?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ❌ ELIMINATI: FirebaseDocument, FirebaseConfig, FirebaseBatchResult, FirebaseError, FirebaseAdapter
// MOTIVAZIONE:
// - FirebaseDocument: Ogni documento ha la sua struttura
// - FirebaseConfig: Firebase SDK ha già il suo tipo
// - FirebaseBatchResult: Non facciamo batch operations complesse
// - FirebaseError: Firebase SDK gestisce già errori
// - FirebaseAdapter: Non serve astrazione Domain↔Firebase