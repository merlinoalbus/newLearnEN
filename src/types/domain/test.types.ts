// =====================================================
// 📁 types/domain/test.types.ts
// Basato ESATTAMENTE sulla struttura test dell'app attuale
// =====================================================

import { BaseEntity } from '../shared/base.types';
import { TestType, Difficulty } from '../shared/enums';

// ====== TEST ENTITY - Struttura ESATTA dall'app attuale ======

/**
 * Test completato - Basato su testHistory dell'app attuale
 * 
 * Mappato da: testHistory localStorage + handleTestComplete
 */
export interface Test extends BaseEntity {
  // Identificazione
  userId: string;               // Proprietario test
  timestamp: Date;              // Quando è stato fatto
  
  // Configurazione test - TUA RICHIESTA
  testType: TestType;           // complete | selective | review | difficult
  selectedChapters: string[];   // Capitoli selezionati per il test
  includeLearnedWords: boolean; // Se includere parole già imparate
  includeDifficultWords: boolean; // Se includere parole difficili
  maxWords?: number;            // Limite parole (opzionale)
  
  // Risultati globali - TUA RICHIESTA ESATTA
  totalWords: number;           // Parole totali nel test
  correctWords: number;         // Risposte corrette
  incorrectWords: number;       // Risposte sbagliate
  totalTime: number;            // Tempo totale in millisecondi
  avgTimePerWord: number;       // Tempo medio per parola in millisecondi
  percentage: number;           // Percentuale successo
  difficulty: Difficulty;       // Difficoltà calcolata del test
  hitsUsed: number;             // Aiuti utilizzati totali - TUA RICHIESTA
  
  // Risultati dettagliati - TUA RICHIESTA
  wrongWords: TestWordResult[]; // Array parole sbagliate con dettagli
  rightWords: TestWordResult[]; // Array parole corrette con dettagli
  
  // Analisi aggiuntive - Dall'app attuale
  chapterStats?: Record<string, ChapterTestStats>; // Stats per capitolo
  difficultyAnalysis?: DifficultyAnalysis;         // Analisi difficoltà
  
  // Legacy compatibility - Dall'app attuale
  legacyDifficulty?: 'easy' | 'medium' | 'hard';  // Vecchio sistema
}

// ====== TEST WORD RESULT - TUA RICHIESTA ESATTA ======

/**
 * Risultato per singola parola nel test - TUA RICHIESTA DETTAGLIATA
 */
export interface TestWordResult {
  wordId: string;               // ID parola
  isCorrect: boolean;           // Se risposta corretta - TUA RICHIESTA
  timeResponse: number;         // Tempo risposta in ms - TUA RICHIESTA
  hintsUsed: number;            // Aiuti usati per questa parola - TUA RICHIESTA
  currentDifficulty: 'easy' | 'medium' | 'hard'; // Difficoltà attuale - TUA RICHIESTA
  
  // Contesto aggiuntivo - Per storico
  wordText?: string;            // Testo parola (backup storico)
  translationText?: string;     // Traduzione (backup storico)
  chapter?: string;             // Capitolo (backup storico)
  userAnswer?: string;          // Risposta data dall'utente
}

// ====== CHAPTER TEST STATS - Dall'app attuale ======

/**
 * Statistiche test per capitolo - Da chapterStats dell'app attuale
 */
export interface ChapterTestStats {
  totalWords: number;           // Parole del capitolo nel test
  correctWords: number;         // Risposte corrette capitolo
  incorrectWords: number;       // Risposte sbagliate capitolo
  hintsUsed: number;            // Aiuti usati nel capitolo
  percentage: number;           // % successo capitolo
  avgTimePerWord: number;       // Tempo medio parole capitolo
}

// ====== DIFFICULTY ANALYSIS - Dall'app attuale ======

/**
 * Analisi difficoltà - Da calculateSmartTestDifficulty dell'app attuale
 */
export interface DifficultyAnalysis {
  baseComplexity: number;       // Complessità base 0-100
  performanceAdjustment: number; // Aggiustamento basato su performance
  finalDifficulty: number;      // Difficoltà finale calcolata
  
  factors: {                    // Fattori che influenzano difficoltà
    wordLength: number;         // Lunghezza media parole
    sentenceComplexity: number; // Complessità frasi
    userPerformance: number;    // Performance storica utente
    timesPracticed: number;     // Volte praticate parole
  };
}

// ====== INPUT TYPES - Per configurare test ======

/**
 * Configurazione per nuovo test - Basata sui parametri app attuale
 */
export interface TestInput {
  testType: TestType;
  selectedChapters: string[];
  includeLearnedWords?: boolean;  // Default false
  includeDifficultWords?: boolean; // Default true
  maxWords?: number;              // Limite parole
}

/**
 * Configurazione avanzata test - Opzioni extra
 */
export interface TestConfiguration {
  // Timing
  maxDuration?: number;         // Durata massima in millisecondi
  timeWarningThreshold?: number; // Soglia warning tempo
  
  // Difficulty
  adaptiveDifficulty?: boolean; // Difficoltà adattiva
  difficultyTarget?: Difficulty; // Difficoltà target
  
  // Hints
  maxHintsPerWord?: number;     // Max aiuti per parola (dall'app: 1)
  hintCooldown?: number;        // Cooldown aiuti (dall'app: 3000ms)
  hintPenalty?: number;         // Penalità aiuti %
  
  // Words selection
  randomizeOrder?: boolean;     // Ordine casuale
  excludeRecentlyShown?: boolean; // Escludi mostrate di recente
  prioritizeDifficult?: boolean; // Priorità parole difficili
}

// ====== TEST STATS - Basate su calcolateStats dell'app attuale ======

/**
 * Statistiche aggregate di tutti i test - Da stats dell'app attuale
 */
export interface TestStats {
  // Contatori globali
  totalTests: number;           // Test totali completati
  totalAnswers: number;         // Risposte totali date
  totalHints: number;           // Aiuti totali usati
  totalTimeSpent: number;       // Tempo totale speso
  
  // Metriche calcolate
  accuracyRate: number;         // % accuratezza globale
  hintsRate: number;            // % aiuti su risposte
  avgTimePerTest: number;       // Tempo medio per test
  avgTimePerWord: number;       // Tempo medio per parola
  
  // Progressione
  isActiveToday: boolean;       // Attivo oggi
  currentStreak: number;        // Streak corrente
  bestStreak: number;           // Miglior streak
  
  // Per tipo di test
  statsByType: Record<TestType, TestTypeStats>;
  
  // Per difficoltà
  statsByDifficulty: Record<Difficulty, DifficultyStats>;
}

/**
 * Statistiche per tipo di test
 */
export interface TestTypeStats {
  testsCompleted: number;
  averageAccuracy: number;
  averageTime: number;
  hintsUsed: number;
}

/**
 * Statistiche per livello difficoltà
 */
export interface DifficultyStats {
  testsCompleted: number;
  averageAccuracy: number;
  averageTime: number;
  improvementRate: number;      // % miglioramento nel tempo
}

// ====== REPOSITORY INTERFACE ======

/**
 * Contratto per persistenza test
 */
export interface TestRepository {
  // CRUD base
  save(test: Test): Promise<Test>;
  findById(id: string): Promise<Test | null>;
  findByUser(userId: string, limit?: number): Promise<Test[]>;
  delete(id: string): Promise<void>;
  
  // Query specifiche - basate sui filtri dell'app attuale
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Test[]>;
  findByType(userId: string, testType: TestType): Promise<Test[]>;
  findByChapter(userId: string, chapter: string): Promise<Test[]>;
  
  // Stats - basate sui calcoli dell'app attuale
  getTestStats(userId: string): Promise<TestStats>;
  getRecentTests(userId: string, days: number): Promise<Test[]>;
}

// ====== DOMAIN SERVICES ======

/**
 * Servizio per logica business test
 */
export interface TestService {
  // Generazione test
  generateTest(userId: string, config: TestInput): Promise<Test>;
  generateAdaptiveTest(userId: string, targetDifficulty: Difficulty): Promise<Test>;
  
  // Esecuzione test
  startTest(testId: string): Promise<void>;
  submitAnswer(testId: string, wordId: string, answer: string, timeSpent: number): Promise<boolean>;
  useHint(testId: string, wordId: string): Promise<string>;
  completeTest(testId: string): Promise<Test>;
  
  // Analisi
  analyzePerformance(userId: string, testId: string): Promise<DifficultyAnalysis>;
  getPersonalizedDifficulty(userId: string, words: string[]): Promise<Difficulty>;
  
  // Stats
  getTestStats(userId: string): Promise<TestStats>;
  getProgressTrend(userId: string, days: number): Promise<number[]>;
}

// ====== TEST ENGINE - Core business logic ======

/**
 * Engine per generazione e gestione test - Logica core dell'app attuale
 */
export interface TestEngine {
  // Selezione parole - da selectTestWords dell'app attuale
  selectWords(
    availableWords: string[], 
    config: TestConfiguration,
    userHistory: Test[]
  ): Promise<string[]>;
  
  // Calcolo difficoltà - da calculateSmartTestDifficulty dell'app attuale
  calculateDifficulty(
    words: string[],
    userPerformance: Record<string, any>
  ): Promise<DifficultyAnalysis>;
  
  // Valutazione risposte
  evaluateAnswer(
    userAnswer: string,
    correctAnswer: string,
    usedHints: number
  ): boolean;
  
  // Calcolo punteggi
  calculateScore(
    correctAnswers: number,
    totalAnswers: number,
    hintsUsed: number,
    timeSpent: number
  ): number;
}