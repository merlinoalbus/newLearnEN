
// =====================================================
// 📁 components/auth/RegisterPage.tsx - Register Component
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      showError('Campi obbligatori', 'Inserisci email e password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Password non corrispondenti', 'Le password inserite non coincidono');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password troppo corta', 'Usa almeno 6 caratteri');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined
      });
      
      showSuccess(
        'Account creato!', 
        'Ti abbiamo inviato un\'email di verifica. Controlla la tua casella di posta.'
      );
      navigate('/');
    } catch (error) {
      showError('Errore registrazione', error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showSuccess('Account creato!', 'Benvenuto in Vocabulary Master!');
      navigate('/');
    } catch (error) {
      showError('Errore Google', error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registrati</h2>
        <p className="text-gray-600 mt-2">
          Crea un account per iniziare il tuo percorso di apprendimento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="displayName"
          placeholder="Nome (opzionale)"
          value={formData.displayName}
          onChange={handleChange}
          autoComplete="name"
        />
        
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        
        <Input
          type="password"
          name="password"
          placeholder="Password (min. 6 caratteri)"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Conferma password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          variant="primary"
        >
          {loading ? 'Registrazione in corso...' : 'Registrati'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">oppure</span>
        </div>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full"
        variant="outline"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continua con Google
      </Button>

      <div className="text-center">
        <div className="text-sm text-gray-600">
          Hai già un account?{' '}
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
};
