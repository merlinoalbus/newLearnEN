// =====================================================
// 📁 types/infrastructure/ai.types.ts
// SOLO tipi Google Gemini essenziali
// =====================================================

/**
 * Configurazione AI service - Da appConfig dell'app attuale
 */
export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
  mockResponses: boolean;       // Per testing
}

/**
 * Request generica AI
 */
export interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemInstructions?: string;
}

/**
 * Response generica AI
 */
export interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
  timestamp: Date;
}