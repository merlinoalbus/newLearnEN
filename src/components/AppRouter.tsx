
// =====================================================
// 📁 components/AppRouter.tsx - Application Router
// =====================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './common/LoadingSpinner';
import { AuthLayout } from './auth/AuthLayout';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { ResetPasswordPage } from './auth/ResetPasswordPage';
import { MainLayout } from './layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { WordsPage } from './pages/WordsPage';
import { TestsPage } from './pages/TestsPage';
import { StatsPage } from './pages/StatsPage';
import { ProfilePage } from './pages/ProfilePage';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        // Auth routes
        <>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      ) : (
        // Protected routes
        <>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="words" element={<WordsPage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};