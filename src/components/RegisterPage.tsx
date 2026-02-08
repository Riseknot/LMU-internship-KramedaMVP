import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Heart, Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, MapPin, Briefcase } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (user: Omit<User, 'id'>) => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [role, setRole] = useState<UserRole>('helper');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    zipCode: '',
    skills: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const availableSkills = [
    'Körperpflege',
    'Medikamentengabe',
    'Haushalt',
    'Einkaufen',
    'Begleitung',
    'Kochen',
    'Mobilität',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: Omit<User, 'id'> = {
      name: formData.name,
      email: formData.email,
      role: role,
      phone: formData.phone || undefined,
      zipCode: formData.zipCode || undefined,
      skills: role === 'helper' ? formData.skills : undefined,
    };

    onRegister(newUser);
    setIsLoading(false);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Heart className="w-9 h-9 text-primary-700" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CareConnect</h1>
          <p className="text-primary-100">Registrieren Sie sich jetzt</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Neues Konto erstellen</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Ich möchte mich registrieren als:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('coordinator')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'coordinator'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 mx-auto mb-2 ${
                    role === 'coordinator' ? 'text-primary-600' : 'text-neutral-400'
                  }`} />
                  <div className="font-medium">Koordinator</div>
                  <div className="text-xs text-neutral-600 mt-1">Pflege organisieren</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('helper')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'helper'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <UserIcon className={`w-6 h-6 mx-auto mb-2 ${
                    role === 'helper' ? 'text-primary-600' : 'text-neutral-400'
                  }`} />
                  <div className="font-medium">Helper</div>
                  <div className="text-xs text-neutral-600 mt-1">Pflege leisten</div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Vollständiger Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Max Mustermann"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                E-Mail-Adresse *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="max.mustermann@beispiel.de"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Passwort *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-11 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+49 123 456789"
                    className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* ZIP Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-2">
                  Postleitzahl {role === 'helper' && '*'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="10115"
                    required={role === 'helper'}
                    pattern="[0-9]{5}"
                    className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Skills (only for helpers) */}
            {role === 'helper' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fähigkeiten *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {formData.skills.length === 0 && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Bitte wählen Sie mindestens eine Fähigkeit aus
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (role === 'helper' && formData.skills.length === 0)}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wird erstellt...
                </>
              ) : (
                'Konto erstellen'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
