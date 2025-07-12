// =====================================================
// 📁 types/ui/auth.types.ts
// UI types per autenticazione - Basati sui form attuali
// =====================================================

import { LoadingState, NotificationType } from '../shared/enums';

/**
 * Dati form login - Basato su LoginPage dell'app attuale
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;         // Per futuro "ricordami"
}

/**
 * Dati form registrazione - Basato su RegisterPage dell'app attuale  
 */
export interface RegisterFormData {
  displayName?: string;         // Nome opzionale
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;        // Per futuro termini servizio
}

/**
 * Dati reset password
 */
export interface ResetPasswordFormData {
  email: string;
}

/**
 * Stato UI autenticazione - Per gestire loading, errori, ecc.
 */
export interface AuthUIState {
  // Loading states
  loginLoading: boolean;
  registerLoading: boolean;
  resetPasswordLoading: boolean;
  googleSignInLoading: boolean;
  
  // Error states
  loginError: string | null;
  registerError: string | null;
  resetPasswordError: string | null;
  
  // Success states
  resetPasswordSent: boolean;
  registrationSuccess: boolean;
  
  // UI flags
  showPassword: boolean;        // Toggle password visibility
  showConfirmPassword: boolean; // Toggle confirm password visibility
  redirectAfterLogin?: string;  // Dove andare dopo login
}

/**
 * Validazione form - Per validazione real-time
 */
export interface AuthFormValidation {
  email: FieldValidation;
  password: FieldValidation;
  confirmPassword?: FieldValidation;
  displayName?: FieldValidation;
  form: FormValidation;
}

export interface FieldValidation {
  isValid: boolean;
  error?: string;
  touched: boolean;             // User ha interagito con il campo
  dirty: boolean;               // Valore è cambiato dal default
}

export interface FormValidation {
  isValid: boolean;
  hasErrors: boolean;
  isDirty: boolean;
  errorCount: number;
}