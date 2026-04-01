import React, { useState } from 'react';
import { User } from '../../types';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { AppLogo } from '../../components/AppLogo';
import { Slogan } from '../../components/Slogan';
import { Badge } from '@/src/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowRegister: () => void;
}

type LoginApiResponse = {
  message?: string;
  user?: User;
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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch {
      setError('Server nicht erreichbar. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-shell-inner w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6">
            <AppLogo />
            <Slogan />
        </div>

        {/* Login Form */}
        <div className="auth-card rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">Anmelden</h2>

            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="cursor-help" aria-label="Login-Hinweis anzeigen">
                  <Badge variant="secondary" className="bg-warning/20 text-warning hover:bg-warning/30">
                    Hinweis zum einloggen/registrieren
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-center max-w-90 leading-5 bg-primary-950 text-white">
                Nur die E-Mail <strong>mr.shockwave@live.de</strong> ist erlaubt. 
              </TooltipContent>
            </Tooltip>


          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-100 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-100 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-neutral-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-base btn-primary w-full py-3 flex items-center justify-center gap-2"
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
            <p className="text-sm text-neutral-200">
              Noch kein Konto?{' '}
              <button
                onClick={onShowRegister}
                className="btn-link font-medium"
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