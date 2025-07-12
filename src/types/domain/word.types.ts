// =====================================================
// 📁 types/domain/word.types.ts
// Basato ESATTAMENTE sull'app attuale analizzata
// =====================================================

import { BaseEntity } from '../shared/base.types';
import { Category } from '../shared/enums';

// ====== WORD ENTITY - Da app attuale ======

/**
 * Parola del vocabolario - Struttura ESATTA dell'app attuale
 * 
 * Mappato da: vocabularyWords localStorage dell'app esistente
 */
export interface Word extends BaseEntity {
  // Core data - ESATTO dall'app attuale
  english: string;              // Parola inglese
  italian: string;              // Traduzione italiana  
  group: Category;              // Categoria (VERBI, SOSTANTIVI, ecc.)
  chapter: string;              // Capitolo/lezione
  
  // Extended content - TUA RICHIESTA modifiche
  sentences: string[];          // MODIFICATO: era `sentence: string` → ora array
  synonyms?: string[];          // AGGIUNTO: array sinonimi (0-n)
  antonyms?: string[];          // AGGIUNTO: array contrari (0-n)
  notes?: string;               // Opzionale - dall'app attuale
  
  // Learning state - ESATTO dall'app attuale
  learned: boolean;             // Parola imparata
  difficult: boolean;           // Marcata come difficile
  
  // Performance tracking - ESATTO dall'app attuale (wordPerformance)
  timesShown: number;           // Volte mostrata nei test
  timesCorrect: number;         // Risposte corrette
  timesIncorrect: number;       // Risposte sbagliate
  averageResponseTime: number;  // Tempo medio risposta
  lastShown?: Date;             // Ultima volta mostrata
  
  // Firebase migration
  userId: string;               // Proprietario (per Firebase)
}

// ====== INPUT TYPES - Per form UI attuale ======

/**
 * Dati per creare nuova parola - Basato sui form attuali
 */
export interface WordInput {
  english: string;
  italian: string;
  group: Category;
  chapter: string;
  sentences?: string[];         // Opzionale - array invece di singola
  synonyms?: string[];          // Opzionale - nuovo
  antonyms?: string[];          // Opzionale - nuovo
  notes?: string;               // Opzionale
}

/**
 * Dati per aggiornare parola esistente
 */
export interface WordUpdate {
  english?: string;
  italian?: string;
  group?: Category;
  chapter?: string;
  sentences?: string[];
  synonyms?: string[];
  antonyms?: string[];
  notes?: string;
  learned?: boolean;
  difficult?: boolean;
}

// ====== QUERY TYPES - Basati su filtri attuali ======

/**
 * Filtri per cercare parole - Basato sui filtri dell'app attuale
 */
export interface WordFilters {
  chapters?: string[];          // Filtro capitoli (presente nell'app)
  groups?: Category[];          // Filtro categorie (presente nell'app)
  learned?: boolean;            // Solo learned/not learned
  difficult?: boolean;          // Solo difficult/normal
  search?: string;              // Ricerca testuale (presente nell'app)
}

/**
 * Ordinamento parole - Opzioni dell'app attuale
 */
export interface WordSortOptions {
  field: WordSortField;
  direction: 'asc' | 'desc';
}

export type WordSortField = 
  | 'english'                   // Alfabetico inglese
  | 'italian'                   // Alfabetico italiano
  | 'createdAt'                 // Data creazione
  | 'chapter'                   // Per capitolo
  | 'group'                     // Per categoria
  | 'timesShown'                // Performance
  | 'averageResponseTime';      // Performance

// ====== STATS TYPES - Basati su wordPerformance attuale ======

/**
 * Statistiche aggregate parole - Da getChapterStats dell'app attuale
 */
export interface WordStats {
  total: number;                // Totale parole
  learned: number;              // Parole imparate
  difficult: number;            // Parole difficili
  
  // Per capitolo - da chapterStats dell'app attuale
  byChapter: Record<string, ChapterWordStats>;
  
  // Per categoria - calcolato da group
  byGroup: Record<Category, GroupWordStats>;
  
  // Performance globale
  averageResponseTime: number;
  totalTimesShown: number;
  globalAccuracy: number;       // % risposte corrette globali
}

/**
 * Statistiche per capitolo - Da chapterStats dell'app attuale
 */
export interface ChapterWordStats {
  totalWords: number;           // Parole nel capitolo
  learnedWords: number;         // Parole imparate
  difficultWords: number;       // Parole difficili
  
  // Performance - da testHistory chapterStats
  testsPerformed: number;       // Test fatti su questo capitolo
  totalCorrect: number;         // Risposte corrette totali
  totalIncorrect: number;       // Risposte sbagliate totali
  averageAccuracy: number;      // % accuratezza media
  hintsUsed: number;            // Aiuti usati totali
}

/**
 * Statistiche per categoria
 */
export interface GroupWordStats {
  totalWords: number;
  learnedWords: number;
  difficultWords: number;
  averageAccuracy: number;
}

// ====== REPOSITORY INTERFACE - Per astrazione storage ======

/**
 * Contratto per persistenza parole - Astrazione su localStorage/Firebase
 */
export interface WordRepository {
  // CRUD base
  save(word: Word): Promise<Word>;
  findById(id: string): Promise<Word | null>;
  findAll(userId: string): Promise<Word[]>;
  update(id: string, updates: WordUpdate): Promise<Word>;
  delete(id: string): Promise<void>;
  
  // Query - basate sui filtri dell'app attuale
  findByFilters(userId: string, filters: WordFilters): Promise<Word[]>;
  findByChapter(userId: string, chapter: string): Promise<Word[]>;
  findByGroup(userId: string, group: Category): Promise<Word[]>;
  findLearned(userId: string, learned: boolean): Promise<Word[]>;
  findDifficult(userId: string, difficult: boolean): Promise<Word[]>;
  
  // Stats - basate sui calcoli dell'app attuale
  getStats(userId: string): Promise<WordStats>;
  getChapterStats(userId: string): Promise<Record<string, ChapterWordStats>>;
  
  // Performance tracking - da wordPerformance dell'app attuale
  updatePerformance(
    wordId: string, 
    isCorrect: boolean, 
    responseTime: number
  ): Promise<void>;
}

// ====== DOMAIN SERVICES ======

/**
 * Servizio per logica business parole
 */
export interface WordService {
  // Gestione parole
  createWord(userId: string, input: WordInput): Promise<Word>;
  updateWord(userId: string, id: string, updates: WordUpdate): Promise<Word>;
  deleteWord(userId: string, id: string): Promise<void>;
  
  // Query
  searchWords(userId: string, filters: WordFilters): Promise<Word[]>;
  getWordsByChapter(userId: string, chapter: string): Promise<Word[]>;
  
  // Learning state management
  markAsLearned(userId: string, wordId: string): Promise<void>;
  markAsDifficult(userId: string, wordId: string): Promise<void>;
  
  // Performance tracking - da recordWordPerformance dell'app attuale
  recordPerformance(
    userId: string,
    wordId: string, 
    isCorrect: boolean,
    usedHint: boolean,
    timeSpent: number
  ): Promise<void>;
  
  // Stats
  getWordStats(userId: string): Promise<WordStats>;
  getAvailableChapters(userId: string): Promise<string[]>;
}