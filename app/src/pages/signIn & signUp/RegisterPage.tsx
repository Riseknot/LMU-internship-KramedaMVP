import { useState } from 'react';
import type { ElementType, ChangeEvent, ReactNode } from 'react';
import { User, UserRole } from '../../types';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, MapPin, Briefcase } from 'lucide-react';
import { Slogan } from '../../components/Slogan';
import { AppLogo } from '../../components/AppLogo';
import InputField from '../../components/InputField';

interface RegisterPageProps {
  onRegister: (user: Omit<User, 'id'>) => void;
  onBackToLogin: () => void;
}

const SKILLS = ['Körperpflege', 'Haushalt', 'Einkaufen', 'Begleitung', 'Kochen', 'Mobilität'];
const inputCls = 'w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';
const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400';
const labelCls = 'block text-sm font-medium text-neutral-700 mb-2';



export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [role, setRole] = useState<UserRole>('helper');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', zipCode: '', skills: [] as string[] });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const toggleSkill = (s: string) =>
    setForm(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    // onRegister({
    //   name: form.name, email: form.email, role,
    //   phone: form.phone || undefined,
    //   zipCode: form.zipCode || undefined,
    //   skills: role === 'helper' ? form.skills : undefined,
    // });
    fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role }),
  });
    setLoading(false);
  };

  const roleCls = (r: UserRole) =>
    `p-4 border-2 rounded-lg transition-all ${role === r ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:border-primary-300'}`;
  const roleIconCls = (r: UserRole) =>
    `w-6 h-6 mx-auto mb-2 ${role === r ? 'text-primary-600' : 'text-neutral-400'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6"><AppLogo /><Slogan /></div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Neues Konto erstellen</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Ich möchte mich registrieren als:</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('coordinator')} className={roleCls('coordinator')}>
                  <Briefcase className={roleIconCls('coordinator')} />
                  <div className="font-medium">Koordinator</div>
                  <div className="text-xs text-neutral-600 mt-1">Pflege organisieren</div>
                </button>
                <button type="button" onClick={() => setRole('helper')} className={roleCls('helper')}>
                  <UserIcon className={roleIconCls('helper')} />
                  <div className="font-medium">Helper</div>
                  <div className="text-xs text-neutral-600 mt-1">Pflege leisten</div>
                </button>
              </div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Keine Sorge, du kannst die Rolle später jederzeit in deinem Profil ändern.
              </label>
            </div>

            <InputField label="Vollständiger Name *" icon={UserIcon}>
              <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="Max Mustermann" required className={inputCls} />
            </InputField>

            <InputField label="E-Mail-Adresse *" icon={Mail}>
              <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="max.mustermann@beispiel.de" required className={inputCls} />
            </InputField>

            <InputField label="Passwort *" icon={Lock}>
              <input id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required minLength={6}
                className="w-full pl-11 pr-11 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </InputField>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Telefon" icon={Phone}>
                <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+49 123 456789" className={inputCls} />
              </InputField>
              <InputField label={`Postleitzahl ${role === 'helper' ? '*' : ''}`} icon={MapPin}>
                <input id="zipCode" type="text" value={form.zipCode} onChange={set('zipCode')} placeholder="10115" required={role === 'helper'} pattern="[0-9]{5}" className={inputCls} />
              </InputField>
            </div>

            {role === 'helper' && (
              <div>
                <label className={labelCls}>Fähigkeiten *</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${form.skills.includes(s) ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {form.skills.length === 0 && <p className="text-xs text-neutral-500 mt-2">Bitte wählen Sie mindestens eine Fähigkeit aus</p>}
              </div>
            )}

            <button type="submit" disabled={loading || (role === 'helper' && form.skills.length === 0)}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Wird erstellt...</>
                : 'Konto erstellen'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onBackToLogin} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              ← Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
