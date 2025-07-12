// =====================================================
// 📁 types/ui/forms.types.ts - SOLO form essenziali
// =====================================================

import { Category } from '../shared/enums';

/**
 * Dati form per aggiungere/modificare parola
 */
export interface WordFormData {
  english: string;
  italian: string;
  group: Category;
  chapter: string;
  
  // TUA RICHIESTA - Gestiti come stringhe separate da newline per semplicità
  sentences: string;            // Textarea con righe separate da \n
  synonyms: string;             // Input con valori separati da virgola
  antonyms: string;             // Input con valori separati da virgola
  notes?: string;
  
  // Flags
  learned: boolean;
  difficult: boolean;
}

/**
 * Configurazione test form - Per creare nuovi test
 */
export interface TestConfigFormData {
  testType: string;             // Sarà convertito in TestType
  selectedChapters: string[];
  includeLearnedWords: boolean;
  includeDifficultWords: boolean;
  maxWords?: number;
}