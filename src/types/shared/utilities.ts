// =====================================================
// 📁 types/shared/utilities.ts - SOLO utilities necessari
// =====================================================

/**
 * Rende opzionali specifiche proprietà
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * ID tipizzati con branding per evitare mix
 */
export type EntityId<T extends string> = string & { readonly __brand: T };

// Specific entity IDs per l'app
export type UserId = EntityId<'User'>;
export type WordId = EntityId<'Word'>;
export type TestId = EntityId<'Test'>;
export type StatsId = EntityId<'Stats'>;

/**
 * Type guard per valori defined
 */
export const isDefined = <T>(value: T | undefined): value is T => 
  value !== undefined;

/**
 * Type guard per valori non null
 */
export const isNotNull = <T>(value: T | null): value is T => 
  value !== null;