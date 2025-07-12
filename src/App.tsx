// =====================================================
// 📁 App.tsx - Main Application Component
// =====================================================

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppRouter } from './components/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LoadingProvider>
          <Router>
            <AuthProvider>
              <DataProvider>
                <AppRouter />
              </DataProvider>
            </AuthProvider>
          </Router>
        </LoadingProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;