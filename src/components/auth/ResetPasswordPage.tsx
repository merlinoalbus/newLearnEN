
// =====================================================
// 📁 components/auth/ResetPasswordPage.tsx - Reset Password
// =====================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError('Email richiesta', 'Inserisci il tuo indirizzo email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      showSuccess(
        'Email inviata!', 
        'Controlla la tua casella di posta per il link di reset della password'
      );
    } catch (error) {
      showError('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-6">
        <div className="text-green-500 text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900">Email Inviata!</h2>
        <p className="text-gray-600">
          Ti abbiamo inviato un link per reimpostare la password. 
          Controlla la tua casella di posta e segui le istruzioni.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => setSent(false)}
            variant="outline"
            className="w-full"
          >
            Invia di nuovo
          </Button>
          <Link
            to="/auth/login"
            className="block text-blue-600 hover:text-blue-500 text-sm"
          >
            Torna al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-600 mt-2">
          Inserisci la tua email per ricevere il link di reset della password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          variant="primary"
        >
          {loading ? 'Invio in corso...' : 'Invia Link Reset'}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ← Torna al login
        </Link>
      </div>
    </div>
  );
};