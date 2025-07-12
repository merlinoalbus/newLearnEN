// =====================================================
// 📁 types/index.ts - Public API FINAL VERSION
// =====================================================

// ====== DOMAIN EXPORTS ======
export type {
  // Word domain
  Word,
  WordInput,
  WordUpdate,
  WordFilters,
  WordSortOptions,
  WordSortField,
  WordStats,
  ChapterWordStats,
  GroupWordStats,
  WordRepository,
  WordService
} from './domain/word.types';

export type {
  // Test domain  
  Test,
  TestInput,
  TestConfiguration,
  TestWordResult,
  ChapterTestStats,
  DifficultyAnalysis,
  TestStats,
  TestTypeStats,
  DifficultyStats,
  TestRepository,
  TestService,
  TestEngine
} from './domain/test.types';

export type {
  // Stats domain
  Stats,
  DailyProgress,
  WeeklyStats,
  MonthlyStats,
  WordPerformance,
  ContextPerformance,
  CalculatedStats,
  ComparisonStats,
  StatsUpdate,
  WordPerformanceUpdate,
  StatsRepository,
  StatsService,
  AnalyticsEngine
} from './domain/stats.types';

// ====== UI EXPORTS ======
export type {
  // Auth UI
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  AuthUIState,
  AuthFormValidation,
  FieldValidation,
  FormValidation
} from './ui/auth.types';

export type {
  // Forms
  WordFormData,
  TestConfigFormData
} from './ui/forms.types';

// ====== SHARED EXPORTS ======
export {
  Category,
  TestType,
  Difficulty
} from './shared/enums';

export {
  TEST_CONFIGURATION,
  CATEGORY_STYLES
} from './shared/constants';

export type {
  BaseEntity
} from './shared/base.types';

export type {
  Optional,
  EntityId,
  UserId,
  WordId,
  TestId,
  StatsId
} from './shared/utilities';

export {
  isDefined,
  isNotNull
} from './shared/utilities';

// ====== INFRASTRUCTURE EXPORTS ======
export type {
  FirebaseQuery,
  FirebaseOrderBy,
  FirebasePagination,
  FirebaseWordDocument,
  FirebaseTestDocument,
  FirebaseTestWordResult,
  FirebaseStatsDocument
} from './infrastructure/firebase.types';

export type {
  AIConfig,
  AIRequest,
  AIResponse
} from './infrastructure/ai.types';

// ====== VERSION INFO ======
export const TYPES_VERSION = '3.0.0';