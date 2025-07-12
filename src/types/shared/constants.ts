// =====================================================
// 📁 types/shared/constants.ts - SOLO constants dall'app attuale
// =====================================================

/**
 * Configurazione test - ESATTO da TEST_CONFIG dell'app attuale
 */
export const TEST_CONFIGURATION = {
  // Soglie warning - ESATTO da warningThresholds
  WARNING_THRESHOLDS: {
    SLOW: 25,                   // Secondi per considerare risposta lenta
    VERY_SLOW: 40               // Secondi per considerare risposta molto lenta
  },
  
  // Timing - ESATTO dall'app attuale
  AUTO_ADVANCE_DELAY: 1500,     // ms di delay auto-advance
  HINT_COOLDOWN: 3000,          // ms di cooldown tra aiuti
  MAX_HINTS_PER_WORD: 1,        // Max aiuti per parola
  
  // Scoring - ESATTO da scoring dell'app attuale
  SCORING: {
    EXCELLENT: 80,              // % per risultato eccellente
    GOOD: 60,                   // % per risultato buono
    VICTORY: 80                 // % per vittoria
  }
} as const;

/**
 * Stili categorie - ESATTO da CATEGORY_STYLES dell'app attuale
 */
export const CATEGORY_STYLES = {
  [Category.VERBI]: {
    color: 'from-red-400 via-red-500 to-red-600',
    icon: '⚡',
    bgColor: 'bg-red-500',
    bgGradient: 'bg-gradient-to-br from-red-500 to-orange-600'
  },
  [Category.VERBI_IRREGOLARI]: {
    color: 'from-red-500 via-red-600 to-red-700',
    icon: '🔄',
    bgColor: 'bg-red-600',
    bgGradient: 'bg-gradient-to-br from-red-600 to-pink-600'
  },
  [Category.SOSTANTIVI]: {
    color: 'from-blue-400 via-blue-500 to-blue-600',
    icon: '🏷️',
    bgColor: 'bg-blue-500',
    bgGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  [Category.AGGETTIVI]: {
    color: 'from-green-400 via-green-500 to-green-600',
    icon: '🎨',
    bgColor: 'bg-green-500',
    bgGradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  [Category.DESCRIZIONI_FISICHE]: {
    color: 'from-teal-400 via-teal-500 to-teal-600',
    icon: '👤',
    bgColor: 'bg-teal-500',
    bgGradient: 'bg-gradient-to-br from-teal-500 to-cyan-600'
  },
  [Category.POSIZIONE_CORPO]: {
    color: 'from-purple-400 via-purple-500 to-purple-600',
    icon: '🧘',
    bgColor: 'bg-purple-500',
    bgGradient: 'bg-gradient-to-br from-purple-500 to-violet-600'
  },
  [Category.EMOZIONI]: {
    color: 'from-pink-400 via-pink-500 to-pink-600',
    icon: '❤️',
    bgColor: 'bg-pink-500',
    bgGradient: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  [Category.EMOZIONI_POSITIVE]: {
    color: 'from-yellow-400 via-yellow-500 to-orange-500',
    icon: '😊',
    bgColor: 'bg-yellow-500',
    bgGradient: 'bg-gradient-to-br from-yellow-400 to-orange-500'
  },
  [Category.EMOZIONI_NEGATIVE]: {
    color: 'from-gray-400 via-gray-500 to-gray-600',
    icon: '😔',
    bgColor: 'bg-gray-500',
    bgGradient: 'bg-gradient-to-br from-gray-500 to-slate-600'
  },
  [Category.LAVORO]: {
    color: 'from-indigo-400 via-indigo-500 to-indigo-600',
    icon: '💼',
    bgColor: 'bg-indigo-500',
    bgGradient: 'bg-gradient-to-br from-indigo-500 to-blue-600'
  },
  [Category.FAMIGLIA]: {
    color: 'from-pink-300 via-pink-400 to-rose-500',
    icon: '👨‍👩‍👧‍👦',
    bgColor: 'bg-pink-400',
    bgGradient: 'bg-gradient-to-br from-pink-400 to-rose-500'
  },
  [Category.TECNOLOGIA]: {
    color: 'from-cyan-400 via-cyan-500 to-blue-500',
    icon: '💻',
    bgColor: 'bg-cyan-500',
    bgGradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  [Category.VESTITI]: {
    color: 'from-purple-300 via-purple-400 to-pink-500',
    icon: '👕',
    bgColor: 'bg-purple-400',
    bgGradient: 'bg-gradient-to-br from-purple-400 to-pink-500'
  }
} as const;