
// =====================================================
// 📁 contexts/DataContext.tsx - Data Management Context
// =====================================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WordsService, TestsService, StatsService } from '../services/firestoreService';
import { useAuth } from './AuthContext';
import { Word, Test, Stats, WordInput } from '../types';

interface DataContextType {
  // Words
  words: Word[];
  wordsLoading: boolean;
  
  // Tests
  tests: Test[];
  testsLoading: boolean;
  
  // Stats
  stats: Stats | null;
  statsLoading: boolean;
  
  // Actions
  addWord: (wordData: WordInput) => Promise<void>;
  updateWord: (wordId: string, updates: Partial<Word>) => Promise<void>;
  deleteWord: (wordId: string) => Promise<void>;
  createTest: (testData: Omit<Test, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData();
      setupRealtimeListeners();
    } else {
      // Clear data when user signs out
      setWords([]);
      setTests([]);
      setStats(null);
    }
  }, [isAuthenticated, user]);

  const loadAllData = async () => {
    if (!user) return;

    try {
      // Load words
      setWordsLoading(true);
      const userWords = await WordsService.getUserWords(user.uid);
      setWords(userWords);

      // Load tests
      setTestsLoading(true);
      const userTests = await TestsService.getUserTests(user.uid);
      setTests(userTests);

      // Load stats
      setStatsLoading(true);
      const userStats = await StatsService.getUserStats(user.uid);
      setStats(userStats);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setWordsLoading(false);
      setTestsLoading(false);
      setStatsLoading(false);
    }
  };

  const setupRealtimeListeners = () => {
    if (!user) return;

    // Listen to words changes
    const unsubscribeWords = WordsService.onUserWordsChange(user.uid, setWords);
    
    // Listen to tests changes
    const unsubscribeTests = TestsService.onUserTestsChange(user.uid, setTests);
    
    // Listen to stats changes
    const unsubscribeStats = StatsService.onUserStatsChange(user.uid, setStats);

    // Cleanup function
    return () => {
      unsubscribeWords();
      unsubscribeTests();
      unsubscribeStats();
    };
  };

  const addWord = async (wordData: WordInput) => {
    if (!user) throw new Error('User not authenticated');
    await WordsService.createWord(user.uid, wordData);
  };

  const updateWord = async (wordId: string, updates: Partial<Word>) => {
    if (!user) throw new Error('User not authenticated');
    await WordsService.updateWord(user.uid, wordId, updates);
  };

  const deleteWord = async (wordId: string) => {
    if (!user) throw new Error('User not authenticated');
    await WordsService.deleteWord(user.uid, wordId);
  };

  const createTest = async (testData: Omit<Test, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    await TestsService.createTest(user.uid, testData);
  };

  const refreshData = async () => {
    await loadAllData();
  };

  const value: DataContextType = {
    words,
    wordsLoading,
    tests,
    testsLoading,
    stats,
    statsLoading,
    addWord,
    updateWord,
    deleteWord,
    createTest,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
