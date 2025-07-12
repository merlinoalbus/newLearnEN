// =====================================================
// 📁 config/firebase.ts - Firebase Configuration
// =====================================================

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// ====== FIREBASE CONFIGURATION ======

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// ====== VALIDATION ======

const validateFirebaseConfig = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN', 
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Firebase environment variables: ${missing.join(', ')}`);
  }
};

// ====== INITIALIZE FIREBASE ======

// Validate config before initialization
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// ====== EMULATOR SETUP (Development) ======

if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  console.log('🔧 Connecting to Firebase Emulators...');
  
  // Connect to Auth Emulator
  if (!auth.config.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  
  // Connect to Firestore Emulator
  if (!db._delegate._databaseId.projectId.includes('demo-')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

// ====== FIRESTORE COLLECTIONS ======

export const COLLECTIONS = {
  USERS: 'users',
  WORDS: 'words',
  TESTS: 'tests',
  STATS: 'stats',
  USER_PREFERENCES: 'userPreferences'
} as const;

// ====== HELPER FUNCTIONS ======

export const getCollectionPath = (collection: string, userId?: string): string => {
  if (userId && ['words', 'tests', 'stats'].includes(collection)) {
    return `users/${userId}/${collection}`;
  }
  return collection;
};

// Check if Firebase is properly initialized
export const isFirebaseConfigured = (): boolean => {
  try {
    return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
  } catch {
    return false;
  }
};

// Get current environment
export const getFirebaseEnvironment = () => {
  const isEmulator = process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    isDevelopment,
    isEmulator,
    isProduction: process.env.NODE_ENV === 'production',
    projectId: firebaseConfig.projectId
  };
};

export default app;

// =====================================================
// 📁 config/gemini.ts - Google AI Configuration
// =====================================================

export interface GeminiConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
  mockResponses: boolean;
}

const getGeminiConfig = (): GeminiConfig => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey && process.env.REACT_APP_ENABLE_AI_FEATURES !== 'false') {
    console.warn('⚠️ Gemini API key not found. AI features will be disabled.');
  }

  return {
    apiKey: apiKey || '',
    baseUrl: process.env.REACT_APP_GEMINI_API_URL || 
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    timeout: parseInt(process.env.REACT_APP_AI_TIMEOUT || '15000'),
    maxRetries: parseInt(process.env.REACT_APP_AI_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.REACT_APP_AI_RETRY_DELAY || '1000'),
    enabled: process.env.REACT_APP_ENABLE_AI_FEATURES !== 'false' && !!apiKey,
    mockResponses: process.env.REACT_APP_MOCK_AI_RESPONSES === 'true'
  };
};

export const geminiConfig = getGeminiConfig();

// =====================================================
// 📁 config/app.ts - App Configuration
// =====================================================

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  environment: 'development' | 'production' | 'test';
  features: {
    aiEnabled: boolean;
    analyticsEnabled: boolean;
    emulatorEnabled: boolean;
  };
  test: {
    warningThresholds: {
      slow: number;
      verySlow: number;
    };
    autoAdvanceDelay: number;
    hintCooldown: number;
    maxHintsPerWord: number;
    scoring: {
      excellent: number;
      good: number;
      victory: number;
    };
  };
  storage: {
    enableAutoBackup: boolean;
    maxHistoryEntries: number;
    compressionEnabled: boolean;
  };
}

export const appConfig: AppConfig = {
  name: 'Vocabulary Master',
  version: '3.0.0',
  description: 'La tua app intelligente per imparare l\'inglese con Firebase',
  environment: (process.env.NODE_ENV as any) || 'development',
  
  features: {
    aiEnabled: geminiConfig.enabled,
    analyticsEnabled: process.env.NODE_ENV === 'production',
    emulatorEnabled: process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true'
  },
  
  test: {
    warningThresholds: {
      slow: 25,
      verySlow: 40
    },
    autoAdvanceDelay: 1500,
    hintCooldown: 3000,
    maxHintsPerWord: 1,
    scoring: {
      excellent: 80,
      good: 60,
      victory: 80
    }
  },
  
  storage: {
    enableAutoBackup: true,
    maxHistoryEntries: 1000,
    compressionEnabled: true
  }
};

// =====================================================
// 📁 utils/environment.ts - Environment Validation
// =====================================================

export interface EnvironmentCheck {
  isValid: boolean;
  missing: string[];
  warnings: string[];
  config: {
    firebase: boolean;
    gemini: boolean;
    analytics: boolean;
  };
}

export const validateEnvironment = (): EnvironmentCheck => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const optional = [
    'REACT_APP_GEMINI_API_KEY',
    'REACT_APP_FIREBASE_MEASUREMENT_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  const warnings = optional.filter(key => !process.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    config: {
      firebase: missing.length === 0,
      gemini: !!process.env.REACT_APP_GEMINI_API_KEY,
      analytics: !!process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    }
  };
};

// Development helper
if (process.env.NODE_ENV === 'development') {
  const envCheck = validateEnvironment();
  
  if (!envCheck.isValid) {
    console.error('❌ Environment configuration incomplete:', envCheck);
  } else {
    console.log('✅ Environment configuration valid');
    if (envCheck.warnings.length > 0) {
      console.warn('⚠️ Optional environment variables missing:', envCheck.warnings);
    }
  }
}