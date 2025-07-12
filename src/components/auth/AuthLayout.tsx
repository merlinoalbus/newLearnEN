// =====================================================
// 📁 components/auth/AuthLayout.tsx - Auth Layout
// =====================================================

import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Vocabulary Master
            </h1>
            <p className="text-gray-600">
              La tua app intelligente per imparare l'inglese
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Outlet />
          </div>
          
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Versione 3.0.0 - Powered by Firebase</p>
          </div>
        </div>
      </div>
    </div>
  );
};