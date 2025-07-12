// =====================================================
// 📁 types/domain/stats.types.ts  
// Basato ESATTAMENTE su vocabularyStats dell'app attuale
// =====================================================

import { BaseEntity } from '../shared/base.types';

// ====== STATS ENTITY - Struttura ESATTA dall'app attuale ======

/**
 * Statistiche utente - Basato su vocabularyStats localStorage
 * 
 * Mappato da: vocabularyStats dell'app attuale + calculateStats
 */
export interface Stats extends BaseEntity {
  userId: string;               // Proprietario statistiche
  
  // Contatori base - ESATTO dall'app attuale
  totalTests: number;           // Test completati totali
  correctAnswers: number;       // Risposte corrette totali
  incorrectAnswers: number;     // Risposte sbagliate totali
  hintsUsed: number;            // Aiuti utilizzati totali
  totalTimeSpent: number;       // Tempo totale speso (millisecondi)
  
  // Metriche calcolate - ESATTO dall'app attuale
  accuracyRate: number;         // % accuratezza (correctAnswers/totalAnswers)
  hintsRate: number;            // % aiuti su risposte totali
  avgTimePerTest: number;       // Tempo medio per test
  avgTimePerWord: number;       // Tempo medio per parola
  
  // Streak e progressione - ESATTO dall'app attuale
  currentStreak: number;        // Giorni consecutivi attuali
  bestStreak: number;           // Miglior streak mai raggiunto
  consecutiveDays: number;      // Giorni consecutivi di studio
  
  // Progressi giornalieri - ESATTO dall'app attuale (dailyProgress)
  dailyProgress: Record<string, DailyProgress>; // key: YYYY-MM-DD
  
  // Dati aggregati temporali
  weeklyStats: WeeklyStats[];   // Statistiche settimanali
  monthlyStats: MonthlyStats[]; // Statistiche mensili
  
  // Metadata temporali
  firstTestDate?: Date;         // Primo test mai fatto
  lastTestDate?: Date;          // Ultimo test fatto
  lastActive?: Date;            // Ultima attività
  
  // Migration flag
  migrated?: boolean;           // Se migrato da localStorage
}

// ====== DAILY PROGRESS - Dall'app attuale ======

/**
 * Progresso giornaliero - Da dailyProgress dell'app attuale
 */
export interface DailyProgress {
  date: string;                 // YYYY-MM-DD
  
  // Contatori giornata - ESATTO dall'app attuale
  tests: number;                // Test completati oggi
  wordsStudied: number;         // Parole studiate oggi
  correctAnswers: number;       // Risposte corrette oggi
  incorrectAnswers: number;     // Risposte sbagliate oggi
  hintsUsed: number;            // Aiuti usati oggi
  timeSpent: number;            // Tempo speso oggi (millisecondi)
  
  // Metriche giornata
  accuracyRate: number;         // % accuratezza giornata
  avgTimePerWord: number;       // Tempo medio parola giornata
  
  // Goals (se implementato)
  dailyGoalMet?: boolean;       // Se obiettivo giornaliero raggiunto
  streak: number;               // Streak al momento di questa giornata
}

// ====== WEEKLY STATS ======

/**
 * Statistiche settimanali aggregate
 */
export interface WeeklyStats {
  weekStart: string;            // YYYY-MM-DD (Lunedì)
  weekEnd: string;              // YYYY-MM-DD (Domenica)
  
  // Totali settimana
  tests: number;
  wordsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  timeSpent: number;
  
  // Metriche settimana
  accuracyRate: number;
  avgTimePerWord: number;
  avgTimePerTest: number;
  
  // Progressione
  streak: number;               // Streak alla fine settimana
  activeDays: number;           // Giorni attivi su 7
  improvementRate: number;      // % miglioramento vs settimana precedente
}

// ====== MONTHLY STATS ======

/**
 * Statistiche mensili aggregate
 */
export interface MonthlyStats {
  month: string;                // YYYY-MM
  
  // Totali mese
  tests: number;
  wordsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  timeSpent: number;
  
  // Metriche mese
  accuracyRate: number;
  avgTimePerWord: number;
  avgTimePerTest: number;
  
  // Progressione mensile
  bestStreak: number;           // Miglior streak del mese
  activeDays: number;           // Giorni attivi nel mese
  newWordsLearned: number;      // Nuove parole imparate
  difficultWordsResolved: number; // Parole difficili risolte
  
  // Comparazione
  improvementRate: number;      // % miglioramento vs mese precedente
  rankPerformance: 'excellent' | 'good' | 'average' | 'poor'; // Ranking performance
}

// ====== WORD PERFORMANCE - Da wordPerformance dell'app attuale ======

/**
 * Performance per singola parola - Da wordPerformance localStorage
 */
export interface WordPerformance {
  wordId: string;               // ID parola
  
  // Contatori base - ESATTO dall'app attuale
  timesShown: number;           // Volte mostrata
  timesCorrect: number;         // Volte corretta
  timesIncorrect: number;       // Volte sbagliata
  hintsUsed: number;            // Aiuti usati totali per questa parola
  
  // Timing - ESATTO dall'app attuale
  averageResponseTime: number;  // Tempo medio risposta
  fastestResponseTime: number;  // Tempo più veloce
  slowestResponseTime: number;  // Tempo più lento
  totalTimeSpent: number;       // Tempo totale speso su questa parola
  
  // Dates - tracking temporale
  firstShown: Date;             // Prima volta mostrata
  lastShown: Date;              // Ultima volta mostrata
  lastCorrect?: Date;           // Ultima risposta corretta
  lastIncorrect?: Date;         // Ultima risposta sbagliata
  
  // Progressione
  currentStreak: number;        // Risposte corrette consecutive attuali
  bestStreak: number;           // Miglior streak per questa parola
  masteryLevel: number;         // Livello padronanza 0-100
  difficulty: 'easy' | 'medium' | 'hard'; // Difficoltà attuale calcolata
  
  // Context performance
  performanceByContext: Record<string, ContextPerformance>;
}

/**
 * Performance per contesto (capitolo, tipo test, ecc.)
 */
export interface ContextPerformance {
  context: string;              // Nome contesto
  timesShown: number;
  timesCorrect: number;
  averageTime: number;
  lastShown: Date;
}

// ====== CALCULATED STATS - Dall'app attuale ======

/**
 * Statistiche calcolate - Da calculatedStats dell'app attuale
 */
export interface CalculatedStats {
  // Selettori - ESATTO da selectors dell'app
  totalTests: number;           // testHistory.length
  totalAnswers: number;         // correctAnswers + incorrectAnswers  
  totalHints: number;           // hintsUsed
  accuracyRate: number;         // Math.round((correctAnswers / totalAnswers) * 100)
  hintsRate: number;            // Math.round((hintsUsed / totalAnswers) * 100)
  isActiveToday: boolean;       // Se attivo oggi
  avgTimePerTest: number;       // testsCompleted > 0 ? timeSpent / testsCompleted : 0
  
  // Performance trends
  last7DaysAccuracy: number[];  // Accuratezza ultimi 7 giorni
  last30DaysActivity: number[]; // Attività ultimi 30 giorni
  improvementTrend: 'improving' | 'stable' | 'declining';
  
  // Comparazioni
  todayVsYesterday: ComparisonStats;
  thisWeekVsLastWeek: ComparisonStats;
  thisMonthVsLastMonth: ComparisonStats;
}

/**
 * Statistiche di comparazione
 */
export interface ComparisonStats {
  accuracyChange: number;       // % change in accuracy
  timeChange: number;           // % change in time
  hintsChange: number;          // % change in hints usage
  testsChange: number;          // % change in tests taken
}

// ====== INPUT TYPES ======

/**
 * Input per aggiornare statistiche dopo test
 */
export interface StatsUpdate {
  testCompleted: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  timeSpent: number;
  date: string;                 // YYYY-MM-DD
}

/**
 * Input per aggiornare performance parola
 */
export interface WordPerformanceUpdate {
  wordId: string;
  isCorrect: boolean;
  usedHint: boolean;
  timeSpent: number;
  context?: string;             // Contesto (capitolo, tipo test, ecc.)
}

// ====== REPOSITORY INTERFACE ======

/**
 * Contratto per persistenza statistiche
 */
export interface StatsRepository {
  // Stats generali
  getStats(userId: string): Promise<Stats>;
  updateStats(userId: string, update: StatsUpdate): Promise<Stats>;
  resetStats(userId: string): Promise<Stats>;
  
  // Word performance
  getWordPerformance(userId: string): Promise<Record<string, WordPerformance>>;
  updateWordPerformance(userId: string, update: WordPerformanceUpdate): Promise<void>;
  getWordAnalysis(userId: string, wordId: string): Promise<WordPerformance>;
  
  // Queries temporali
  getDailyProgress(userId: string, date: string): Promise<DailyProgress | null>;
  getWeeklyStats(userId: string, weekStart: string): Promise<WeeklyStats | null>;
  getMonthlyStats(userId: string, month: string): Promise<MonthlyStats | null>;
  
  // Analytics
  getCalculatedStats(userId: string): Promise<CalculatedStats>;
  getTrendData(userId: string, days: number): Promise<number[]>;
}

// ====== DOMAIN SERVICES ======

/**
 * Servizio per logica business statistiche
 */
export interface StatsService {
  // Core stats
  refreshStats(userId: string): Promise<Stats>;
  handleTestComplete(userId: string, testResults: any): Promise<Stats>;
  
  // Performance tracking - da recordWordPerformance dell'app
  recordWordPerformance(
    userId: string,
    wordId: string,
    isCorrect: boolean,
    usedHint: boolean,
    timeSpent: number
  ): Promise<void>;
  
  // Analytics - da getWordAnalysis dell'app
  getWordAnalysis(userId: string, wordId: string): Promise<WordPerformance>;
  getProgressAnalysis(userId: string): Promise<CalculatedStats>;
  
  // Aggregations
  calculateDailyProgress(userId: string, date: string): Promise<DailyProgress>;
  calculateWeeklyStats(userId: string, weekStart: string): Promise<WeeklyStats>;
  calculateMonthlyStats(userId: string, month: string): Promise<MonthlyStats>;
  
  // Export/Import - dall'app attuale
  exportData(userId: string): Promise<any>;
  importData(userId: string, data: any): Promise<void>;
  
  // Cleanup
  clearTestHistory(userId: string): Promise<void>;
  clearHistoryOnly(userId: string): Promise<void>;
}

// ====== ANALYTICS ENGINE ======

/**
 * Engine per calcoli analytics avanzati
 */
export interface AnalyticsEngine {
  // Trend analysis
  calculateAccuracyTrend(stats: Stats[], days: number): Promise<number[]>;
  calculateActivityTrend(dailyProgress: DailyProgress[], days: number): Promise<number[]>;
  
  // Performance analysis
  analyzeLearningVelocity(wordPerformance: Record<string, WordPerformance>): Promise<number>;
  analyzeWeakAreas(stats: Stats, wordPerformance: Record<string, WordPerformance>): Promise<string[]>;
  
  // Predictions
  predictNextDifficulty(wordPerformance: WordPerformance): Promise<'easy' | 'medium' | 'hard'>;
  predictOptimalStudyTime(stats: Stats): Promise<number>;
  
  // Recommendations
  generateStudyRecommendations(userId: string): Promise<string[]>;
  recommendOptimalTestLength(stats: Stats): Promise<number>;
}