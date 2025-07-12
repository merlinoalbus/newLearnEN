

// =====================================================
// 📁 components/layout/Sidebar.tsx - Sidebar Navigation
// =====================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Parole', href: '/words', icon: '📚' },
  { name: 'Test', href: '/tests', icon: '🎯' },
  { name: 'Statistiche', href: '/stats', icon: '📊' },
  { name: 'Profilo', href: '/profile', icon: '👤' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};