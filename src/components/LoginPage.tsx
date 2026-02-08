import React, { useState } from 'react';
import { User } from '../types';
import { Heart, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onShowRegister: () => void;
}

export function LoginPage({ users, onLogin, onShowRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      // In a real app, password would be validated
      // For demo purposes, any password works
      onLogin(user);
    } else {
      setError('Benutzer nicht gefunden. Bitte überprüfen Sie Ihre E-Mail-Adresse.');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (userEmail: string) => {
    const user = users.find(u => u.email === userEmail);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Heart className="w-9 h-9 text-primary-700" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CareConnect</h1>
          <p className="text-primary-100">Pflege koordiniert. Einfach. Vertrauensvoll.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Anmelden</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wird angemeldet...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Noch kein Konto?{' '}
              <button
                onClick={onShowRegister}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Jetzt registrieren
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">Demo-Zugang</span>
            </div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('anna.schmidt@care.de')}
              className="w-full px-4 py-2.5 border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50 rounded-lg text-sm font-medium text-neutral-700 transition-all"
            >
              Als Koordinator anmelden
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('max.mueller@care.de')}
              className="w-full px-4 py-2.5 border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50 rounded-lg text-sm font-medium text-neutral-700 transition-all"
            >
              Als Helper anmelden
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              <strong>Tipp:</strong> Nutzen Sie eine der E-Mail-Adressen von den Demo-Buttons
            </p>
          </div>
        </div>

        {/* Available Test Accounts Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm text-white font-medium mb-2">Verfügbare Test-Accounts:</p>
          <div className="space-y-1 text-xs text-primary-100">
            <div>• anna.schmidt@care.de (Koordinator)</div>
            <div>• max.mueller@care.de (Helper)</div>
            <div>• sophie.weber@care.de (Helper)</div>
          </div>
        </div>
      </div>
    </div>
  );
}