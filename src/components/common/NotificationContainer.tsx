
// =====================================================
// 📁 components/common/NotificationContainer.tsx - Notifications
// =====================================================

import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { cn } from '../../utils/cn';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden border-l-4',
            {
              'border-green-500': notification.type === 'success',
              'border-red-500': notification.type === 'error',
              'border-yellow-500': notification.type === 'warning',
              'border-blue-500': notification.type === 'info',
            }
          )}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <span className="text-green-500">✅</span>}
                {notification.type === 'error' && <span className="text-red-500">❌</span>}
                {notification.type === 'warning' && <span className="text-yellow-500">⚠️</span>}
                {notification.type === 'info' && <span className="text-blue-500">ℹ️</span>}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                {notification.message && (
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <span className="text-lg">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};