// =====================================================
// 📁 types/shared/enums.ts - SOLO enum necessari per l'app
// =====================================================

/**
 * Categorie parole - ESATTO da CATEGORIES dell'app attuale
 */
export enum Category {
  VERBI = 'VERBI',
  VERBI_IRREGOLARI = 'VERBI_IRREGOLARI', 
  SOSTANTIVI = 'SOSTANTIVI',
  AGGETTIVI = 'AGGETTIVI',
  DESCRIZIONI_FISICHE = 'DESCRIZIONI_FISICHE',
  POSIZIONE_CORPO = 'POSIZIONE_CORPO',
  EMOZIONI = 'EMOZIONI',
  EMOZIONI_POSITIVE = 'EMOZIONI_POSITIVE',
  EMOZIONI_NEGATIVE = 'EMOZIONI_NEGATIVE',
  LAVORO = 'LAVORO',
  FAMIGLIA = 'FAMIGLIA',
  TECNOLOGIA = 'TECNOLOGIA',
  VESTITI = 'VESTITI'
}

/**
 * Tipi di test - Dall'app attuale + TUA RICHIESTA
 */
export enum TestType {
  COMPLETE = 'complete',       // Test completo
  SELECTIVE = 'selective',     // Test selettivo per capitoli
  REVIEW = 'review',           // Ripasso parole imparate
  DIFFICULT = 'difficult'      // Solo parole difficili
}

/**
 * Livelli difficoltà - Da calculateSmartTestDifficulty dell'app attuale
 */
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium', 
  HARD = 'hard',
  EXPERT = 'expert'
}