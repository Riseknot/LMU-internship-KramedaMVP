import React, { useState } from 'react';
import { User } from '../../types';
import { Heart, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { AppLogo } from '../../components/AppLogo';
import { Slogan } from '../../components/Slogan';
import { Badge } from '@/src/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowRegister: () => void;
}

type LoginApiResponse = {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: User['role'];
    phone?: string;
    zipCode?: string;
    skills?: string[];
  };
};

export function LoginPage({ onLogin, onShowRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Attempting login with:', { email, password });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as LoginApiResponse;

      if (!res.ok) {
        setError(data.message || 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
        return;
      }

      if (!data.user) {
        setError('Ungültige Antwort vom Server. Bitte versuchen Sie es erneut.');
        return;
      }

      onLogin(data.user);
    } catch (err) {
      setError('Server nicht erreichbar. Bitte versuchen Sie es erneut.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6">
            <AppLogo />
            <Slogan />
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-neutral-900">Anmelden</h2>

            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="cursor-help" aria-label="Login-Hinweis anzeigen">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
                    Hinweis zum einloggen/registrieren
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-center max-w-90 leading-5 bg-blue-950 text-white">
                Nur die E-Mail <strong>mr.shockwave@live.de</strong> ist erlaubt. 
              </TooltipContent>
            </Tooltip>


          </div>

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

        </div>
      </div>
    </div>
  );
}