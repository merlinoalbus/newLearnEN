// =====================================================
// 📁 types/shared/base.types.ts - SOLO tipi base necessari
// =====================================================

/**
 * Entità base con metadati comuni per Firebase
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ❌ ELIMINATI: AuditableEntity, SoftDeletableEntity, TimestampedEntity
// MOTIVAZIONE:
// - AuditableEntity: Non tracciamo createdBy/updatedBy nell'app attuale
// - SoftDeletableEntity: Non facciamo soft delete nell'app attuale  
// - TimestampedEntity: Se serve BaseEntity, se non serve niente