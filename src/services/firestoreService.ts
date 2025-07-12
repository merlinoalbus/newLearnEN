// =====================================================
// 📁 services/firestoreService.ts - Firestore Database Service
// =====================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import { 
  Word, 
  Test, 
  Stats, 
  WordInput,
  TestInput,
  FirebaseQuery,
  FirebaseOrderBy,
  FirebasePagination,
  ApiResponse,
  PaginatedResponse
} from '../types';

// ====== BASE FIRESTORE SERVICE ======

export class FirestoreService {
  
  // ====== UTILITY METHODS ======

  /**
   * Convert Firestore timestamp to Date
   */
  private static timestampToDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  }

  /**
   * Convert document data with proper typing
   */
  private static convertDocumentData<T>(doc: DocumentSnapshot): T | null {
    if (!doc.exists()) return null;
    
    const data = doc.data();
    if (!data) return null;

    // Convert Firestore timestamps to Date objects
    const convertedData = { ...data };
    Object.keys(convertedData).forEach(key => {
      if (convertedData[key] instanceof Timestamp) {
        convertedData[key] = this.timestampToDate(convertedData[key]);
      }
    });

    return {
      id: doc.id,
      ...convertedData
    } as T;
  }

  /**
   * Get user collection reference
   */
  private static getUserCollection(userId: string, collectionName: string) {
    return collection(db, `users/${userId}/${collectionName}`);
  }

  /**
   * Build Firestore query
   */
  private static buildQuery(
    collectionRef: any,
    queries?: FirebaseQuery[],
    orderByClause?: FirebaseOrderBy,
    pagination?: FirebasePagination
  ) {
    let q = collectionRef;

    // Add where clauses
    if (queries) {
      queries.forEach(queryClause => {
        q = query(q, where(queryClause.field, queryClause.operator, queryClause.value));
      });
    }

    // Add orderBy clause
    if (orderByClause) {
      q = query(q, orderBy(orderByClause.field, orderByClause.direction));
    }

    // Add pagination
    if (pagination) {
      if (pagination.startAfter) {
        q = query(q, startAfter(pagination.startAfter), limit(pagination.limit));
      } else {
        q = query(q, limit(pagination.limit));
      }
    }

    return q;
  }

  // ====== GENERIC CRUD OPERATIONS ======

  /**
   * Create document
   */
  static async createDocument<T>(
    collectionPath: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    customId?: string
  ): Promise<T> {
    try {
      const docRef = customId 
        ? doc(db, collectionPath, customId)
        : doc(collection(db, collectionPath));

      const documentData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, documentData);

      // Get the created document to return with proper typing
      const createdDoc = await getDoc(docRef);
      return this.convertDocumentData<T>(createdDoc)!;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  static async getDocument<T>(
    collectionPath: string,
    documentId: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      const docSnap = await getDoc(docRef);
      return this.convertDocumentData<T>(docSnap);
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Update document
   */
  static async updateDocument(
    collectionPath: string,
    documentId: string,
    updates: Record<string, any>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(
    collectionPath: string,
    documentId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get documents with query
   */
  static async getDocuments<T>(
    collectionPath: string,
    queries?: FirebaseQuery[],
    orderByClause?: FirebaseOrderBy,
    pagination?: FirebasePagination
  ): Promise<PaginatedResponse<T>> {
    try {
      const collectionRef = collection(db, collectionPath);
      const q = this.buildQuery(collectionRef, queries, orderByClause, pagination);
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => 
        this.convertDocumentData<T>(doc)!
      );

      return {
        success: true,
        data: documents,
        total: documents.length,
        page: 1, // You might want to implement proper pagination
        limit: pagination?.limit || documents.length,
        hasMore: documents.length === (pagination?.limit || 0)
      };
    } catch (error) {
      console.error('Error getting documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        total: 0,
        page: 1,
        limit: 0,
        hasMore: false
      };
    }
  }

  /**
   * Listen to document changes
   */
  static onDocumentChange<T>(
    collectionPath: string,
    documentId: string,
    callback: (document: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionPath, documentId);
    
    return onSnapshot(docRef, (doc) => {
      const data = this.convertDocumentData<T>(doc);
      callback(data);
    });
  }

  /**
   * Listen to collection changes
   */
  static onCollectionChange<T>(
    collectionPath: string,
    callback: (documents: T[]) => void,
    queries?: FirebaseQuery[],
    orderByClause?: FirebaseOrderBy
  ): () => void {
    const collectionRef = collection(db, collectionPath);
    const q = this.buildQuery(collectionRef, queries, orderByClause);
    
    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => 
        this.convertDocumentData<T>(doc)!
      );
      callback(documents);
    });
  }

  /**
   * Batch write operations
   */
  static async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(db);

      operations.forEach(operation => {
        const docRef = operation.id 
          ? doc(db, operation.collection, operation.id)
          : doc(collection(db, operation.collection));

        switch (operation.type) {
          case 'create':
            batch.set(docRef, {
              ...operation.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...operation.data,
              updatedAt: serverTimestamp()
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error in batch write:', error);
      throw error;
    }
  }
}

// ====== WORDS SERVICE ======

export class WordsService extends FirestoreService {
  
  private static getWordsCollection(userId: string) {
    return this.getUserCollection(userId, COLLECTIONS.WORDS);
  }

  /**
   * Create a new word
   */
  static async createWord(userId: string, wordData: WordInput): Promise<Word> {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    
    const wordWithUserId: Omit<Word, 'id' | 'createdAt' | 'updatedAt'> = {
      ...wordData,
      userId,
      learned: false,
      difficult: false,
      timesShown: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      averageResponseTime: 0,
      sentences: wordData.sentences || [],
      synonyms: wordData.synonyms || [],
      antonyms: wordData.antonyms || []
    };

    return await this.createDocument<Word>(collectionPath, wordWithUserId);
  }

  /**
   * Get all words for user
   */
  static async getUserWords(userId: string): Promise<Word[]> {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    const response = await this.getDocuments<Word>(
      collectionPath,
      undefined,
      { field: 'createdAt', direction: 'desc' }
    );
    return response.data || [];
  }

  /**
   * Get words by chapter
   */
  static async getWordsByChapter(userId: string, chapter: string): Promise<Word[]> {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    const response = await this.getDocuments<Word>(
      collectionPath,
      [{ field: 'chapter', operator: '==', value: chapter }],
      { field: 'createdAt', direction: 'desc' }
    );
    return response.data || [];
  }

  /**
   * Update word
   */
  static async updateWord(
    userId: string, 
    wordId: string, 
    updates: Partial<Word>
  ): Promise<void> {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    await this.updateDocument(collectionPath, wordId, updates);
  }

  /**
   * Delete word
   */
  static async deleteWord(userId: string, wordId: string): Promise<void> {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    await this.deleteDocument(collectionPath, wordId);
  }

  /**
   * Listen to user words changes
   */
  static onUserWordsChange(
    userId: string, 
    callback: (words: Word[]) => void
  ): () => void {
    const collectionPath = `users/${userId}/${COLLECTIONS.WORDS}`;
    return this.onCollectionChange<Word>(
      collectionPath,
      callback,
      undefined,
      { field: 'createdAt', direction: 'desc' }
    );
  }
}

// ====== TESTS SERVICE ======

export class TestsService extends FirestoreService {
  
  /**
   * Create a new test
   */
  static async createTest(userId: string, testData: Omit<Test, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Test> {
    const collectionPath = `users/${userId}/${COLLECTIONS.TESTS}`;
    
    const testWithUserId: Omit<Test, 'id' | 'createdAt' | 'updatedAt'> = {
      ...testData,
      userId
    };

    return await this.createDocument<Test>(collectionPath, testWithUserId);
  }

  /**
   * Get user tests
   */
  static async getUserTests(
    userId: string,
    limitCount: number = 50
  ): Promise<Test[]> {
    const collectionPath = `users/${userId}/${COLLECTIONS.TESTS}`;
    const response = await this.getDocuments<Test>(
      collectionPath,
      undefined,
      { field: 'timestamp', direction: 'desc' },
      { limit: limitCount }
    );
    return response.data || [];
  }

  /**
   * Get test by ID
   */
  static async getTest(userId: string, testId: string): Promise<Test | null> {
    const collectionPath = `users/${userId}/${COLLECTIONS.TESTS}`;
    return await this.getDocument<Test>(collectionPath, testId);
  }

  /**
   * Listen to user tests changes
   */
  static onUserTestsChange(
    userId: string, 
    callback: (tests: Test[]) => void,
    limitCount: number = 50
  ): () => void {
    const collectionPath = `users/${userId}/${COLLECTIONS.TESTS}`;
    return this.onCollectionChange<Test>(
      collectionPath,
      callback,
      undefined,
      { field: 'timestamp', direction: 'desc' }
    );
  }
}

// ====== STATS SERVICE ======

export class StatsService extends FirestoreService {
  
  /**
   * Get or create user stats
   */
  static async getUserStats(userId: string): Promise<Stats> {
    const collectionPath = `users/${userId}/${COLLECTIONS.STATS}`;
    let stats = await this.getDocument<Stats>(collectionPath, 'main');
    
    if (!stats) {
      // Create initial stats
      const initialStats: Omit<Stats, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        totalTests: 0,
        totalWords: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        hintsUsed: 0,
        totalTimeSpent: 0,
        accuracyRate: 0,
        hintsRate: 0,
        avgTimePerTest: 0,
        avgTimePerWord: 0,
        currentStreak: 0,
        bestStreak: 0,
        consecutiveDays: 0,
        dailyProgress: {},
        weeklyStats: [],
        monthlyStats: []
      };
      
      stats = await this.createDocument<Stats>(collectionPath, initialStats, 'main');
    }
    
    return stats;
  }

  /**
   * Update user stats
   */
  static async updateUserStats(
    userId: string, 
    updates: Partial<Stats>
  ): Promise<void> {
    const collectionPath = `users/${userId}/${COLLECTIONS.STATS}`;
    await this.updateDocument(collectionPath, 'main', updates);
  }

  /**
   * Listen to user stats changes
   */
  static onUserStatsChange(
    userId: string, 
    callback: (stats: Stats | null) => void
  ): () => void {
    const collectionPath = `users/${userId}/${COLLECTIONS.STATS}`;
    return this.onDocumentChange<Stats>(collectionPath, 'main', callback);
  }
}

// ====== DEFAULT EXPORT ======

export { FirestoreService as default, WordsService, TestsService, StatsService };