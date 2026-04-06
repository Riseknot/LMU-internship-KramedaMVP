import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { User, UserRole } from '../src/types';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RefreshCcw,
} from 'lucide-react';
import { Slogan } from '../src/components/Slogan';
import { AppLogo } from '../src/components/AppLogo';
import InputField from '../src/components/InputField';

interface RegisterPageProps {
  onRegister: (user: User) => void;
  onBackToLogin: () => void;
}

type RegisterForm = {
  firstname: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  zipCode: string;
  city: string;
  street: string;
  streetNumber: string;
  skills: string[];
  acceptTerms: boolean;
};

type FieldErrors = Partial<Record<keyof RegisterForm | 'role' | 'verificationCode', string>>;
type RegisterApiError = { message?: string; fieldErrors?: Record<string, string> };
type RegisterApiResponse = RegisterApiError & {
  challengeId?: string;
  expiresAt?: number;
  developmentCode?: string;
};
type VerifyApiResponse = RegisterApiError & {
  user?: {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    role: UserRole;
    phone?: string;
    address?: User['address'];
    skills?: string[];
    emailVerified?: boolean;
  };
};

const SKILLS = ['Körperpflege', 'Haushalt', 'Einkaufen', 'Begleitung', 'Kochen', 'Mobilität'];
const INPUT_CLS = 'w-full pl-11 pr-4 py-3 border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';
const PW_INPUT_CLS = 'w-full pl-11 pr-11 py-3 border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';
const PW_RULES = [
  { key: 'len', label: 'Mindestens 10 Zeichen', test: (v: string) => v.length >= 10 },
  { key: 'up', label: 'Mindestens ein Großbuchstabe', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'low', label: 'Mindestens ein Kleinbuchstabe', test: (v: string) => /[a-z]/.test(v) },
  { key: 'num', label: 'Mindestens eine Zahl', test: (v: string) => /\d/.test(v) },
  { key: 'special', label: 'Mindestens ein Sonderzeichen', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+0-9()\-\s]{7,20}$/;
const zipRegex = /^\d{5}$/;
const codeRegex = /^\d{6}$/;

const errCls = (base: string, hasErr?: string) =>
  hasErr ? `${base} border-error/40 focus:ring-error` : base;

const pwStrength = (pw: string) => {
  const pass = PW_RULES.filter((r) => r.test(pw)).length;
  if (pass <= 2) return { label: 'Schwach', bar: 'w-1/3 bg-error' };
  if (pass <= 4) return { label: 'Mittel', bar: 'w-2/3 bg-warning' };
  return { label: 'Stark', bar: 'w-full bg-success/100' };
};

const mapFieldErrors = (x?: Record<string, string>): FieldErrors => ({
  firstname: x?.firstname,
  surname: x?.surname,
  email: x?.email,
  password: x?.password,
  confirmPassword: x?.confirmPassword,
  phone: x?.phone,
  zipCode: x?.zipCode,
  city: x?.city,
  street: x?.street,
  streetNumber: x?.streetNumber,
  skills: x?.skills,
  acceptTerms: x?.acceptTerms,
  role: x?.role,
  verificationCode: x?.verificationCode,
});

function validate(form: RegisterForm, role: UserRole): FieldErrors {
  const e: FieldErrors = {};
  if (form.firstname.trim().length < 2) e.firstname = 'Bitte geben Sie Ihren Vornamen an.';
  if (form.surname.trim().length < 2) e.surname = 'Bitte geben Sie Ihren Nachnamen an.';
  if (!mailRegex.test(form.email.trim().toLowerCase())) e.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
  if (!PW_RULES.every((r) => r.test(form.password))) e.password = 'Bitte erfüllen Sie alle Passwort-Anforderungen.';
  if (form.password !== form.confirmPassword) e.confirmPassword = 'Die Passwörter stimmen nicht überein.';
  if (form.phone.trim() && !phoneRegex.test(form.phone)) e.phone = 'Bitte geben Sie eine gültige Telefonnummer ein.';
  if (role === 'helper') {
    if (!zipRegex.test(form.zipCode.trim())) e.zipCode = 'Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.';
    if (form.city.trim().length < 2) e.city = 'Bitte geben Sie die Stadt an.';
    if (form.street.trim().length < 2) e.street = 'Bitte geben Sie die Straße an.';
    if (form.streetNumber.trim().length < 1) e.streetNumber = 'Bitte geben Sie die Hausnummer an.';
    if (!form.skills.length) e.skills = 'Bitte wählen Sie mindestens eine Fähigkeit aus.';
  }
  if (!form.acceptTerms) e.acceptTerms = 'Bitte akzeptieren Sie die Nutzungsbedingungen und Datenschutzerklärung.';
  return e;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [role, setRole] = useState<UserRole>('helper');
  const [form, setForm] = useState<RegisterForm>({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    zipCode: '',
    city: '',
    street: '',
    streetNumber: '',
    skills: [],
    acceptTerms: false,
  });
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [developmentCode, setDevelopmentCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const strength = pwStrength(form.password);

  const setValue = (k: keyof RegisterForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const toggleSkill = (skill: string) =>
    setForm((p) => {
      const skills = p.skills.includes(skill) ? p.skills.filter((x) => x !== skill) : [...p.skills, skill];
      if (errors.skills && skills.length) setErrors((prev) => ({ ...prev, skills: undefined }));
      return { ...p, skills };
    });

  const startCooldown = (s: number) => {
    setResendCooldown(s);
    const id = window.setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) {
          clearInterval(id);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  };

const submitRegister = async () => {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: form.firstname.trim(),
        surname: form.surname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone.trim(),
        address: {
          zipCode: form.zipCode.trim(),
          city: form.city.trim(),
          street: form.street.trim(),
          streetNumber: form.streetNumber.trim(),
        },
        skills: form.skills,
        role,
        acceptTerms: form.acceptTerms,
      }),
    });

    const data = (await res.json()) as RegisterApiResponse;

    if (!res.ok) {
      if (data.fieldErrors) {
        setErrors(mapFieldErrors(data.fieldErrors));
      }
      throw new Error(data.message || "Registrierung fehlgeschlagen.");
    }

    // Erfolg – Daten vom Backend nutzen
    setChallengeId(data.challengeId || "");
    setExpiresAt(data.expiresAt || null);
    setDevelopmentCode(data.developmentCode || "");
    setRequestSuccess(data.message || "Bestätigungscode wurde versendet.");
    setStep("verify");
    startCooldown(30);
  } catch (err: any) {
    console.error("Fehler beim Registrieren:", err);
    // Optional: globalen Fehlerstate setzen
    setRequestError(err.message || "Unbekannter Fehler");
  }
};

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');
    const vErr = validate(form, role);
    if (Object.keys(vErr).length) {
      setErrors(vErr);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await submitRegister();
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');

    if (!codeRegex.test(verificationCode)) {
      setErrors((p) => ({ ...p, verificationCode: 'Bitte geben Sie einen gültigen 6-stelligen Code ein.' }));
      return;
    }

    setErrors((p) => ({ ...p, verificationCode: undefined }));
    setVerifyLoading(true);

    try {
      const res = await fetch('/api/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code: verificationCode }),
      });
      const data = (await res.json()) as VerifyApiResponse;
      if (!res.ok) throw new Error(data.message || 'Bestätigung fehlgeschlagen.');
      if (!data.user) throw new Error('Benutzerdaten fehlen in der Serverantwort.');

      setRequestSuccess(data.message || 'E-Mail bestätigt. Konto wird vorbereitet...');
      window.setTimeout(() => {
        onRegister(data.user as User);
      }, 900);
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : 'Bestätigung fehlgeschlagen.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const resendCode = async () => {
    if (resendCooldown || loading) return;
    setRequestError('');
    setRequestSuccess('');
    setLoading(true);
    try {
      await submitRegister();
      setVerificationCode('');
      setRequestSuccess('Ein neuer Bestätigungscode wurde versendet.');
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : 'Code konnte nicht erneut versendet werden.');
    } finally {
      setLoading(false);
    }
  };

  const roleBtn = (r: UserRole) =>
    `btn-base w-full rounded-lg p-4 text-center transition-all ${role === r ? 'btn-secondary text-white' : 'btn-ghost'}`;

  return (
    <div className="auth-shell">
      <div className="auth-shell-inner w-full max-w-2xl">
        <div className="text-center mb-6"><AppLogo /><Slogan /></div>

        <div className="auth-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Neues Konto erstellen</h2>
          <p className="text-sm text-neutral-200 mb-6">
            {step === 'form'
              ? 'Sicher registrieren mit E-Mail-Bestätigung und starken Passwort-Richtlinien.'
              : 'Bitte bestätigen Sie Ihre E-Mail-Adresse mit dem zugesendeten 6-stelligen Code.'}
          </p>

          {!!requestError && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{requestError}</span>
            </div>
          )}

          {!!requestSuccess && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-success/25 bg-success/10 p-4 text-sm text-success">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{requestSuccess}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-100 mb-3">Ich möchte mich registrieren als:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setRole('coordinator')} className={roleBtn('coordinator')}>
                    <Briefcase className={`w-6 h-6 mx-auto mb-2 ${role === 'coordinator' ? 'text-primary-400' : 'text-neutral-200'}`} />
                    <div className="font-medium">Koordinator</div>
                    <div className="text-xs text-neutral-200 mt-1">Pflege organisieren</div>
                  </button>
                  <button type="button" onClick={() => setRole('helper')} className={roleBtn('helper')}>
                    <UserIcon className={`w-6 h-6 mx-auto mb-2 ${role === 'helper' ? 'text-primary-400' : 'text-neutral-200'}`} />
                    <div className="font-medium">Helper</div>
                    <div className="text-xs text-neutral-200 mt-1">Pflege leisten</div>
                  </button>
                </div>
                <p className="mt-3 text-xs text-neutral-200">Die Rolle kann später im Profil angepasst werden.</p>
              </div>

              <InputField label="Vorname *" icon={UserIcon}>
                <input id="firstname" type="text" value={form.firstname} onChange={setValue('firstname')} required placeholder="Max" className={errCls(INPUT_CLS, errors.firstname)} />
              </InputField>
              {!!errors.firstname && <p className="-mt-3 text-xs text-error">{errors.firstname}</p>}

              <InputField label="Nachname *" icon={UserIcon}>
                <input id="surname" type="text" value={form.surname} onChange={setValue('surname')} required placeholder="Mustermann" className={errCls(INPUT_CLS, errors.surname)} />
              </InputField>
              {!!errors.surname && <p className="-mt-3 text-xs text-error">{errors.surname}</p>}

              <InputField label="E-Mail-Adresse *" icon={Mail}>
                <input id="email" type="email" value={form.email} onChange={setValue('email')} required placeholder="max.mustermann@beispiel.de" className={errCls(INPUT_CLS, errors.email)} />
              </InputField>
              {!!errors.email && <p className="-mt-3 text-xs text-error">{errors.email}</p>}

              <InputField label="Passwort *" icon={Lock}>
                <input id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={setValue('password')} required placeholder="••••••••" className={errCls(PW_INPUT_CLS, errors.password)} />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="btn-link absolute right-3 top-1/2 -translate-y-1/2 p-1">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </InputField>
              <div className="-mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-600">Passwortstärke</span>
                  <span className="text-neutral-700">{strength.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-200"><div className={`h-full ${strength.bar} transition-all`} /></div>
                <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-neutral-600 sm:grid-cols-2">
                  {PW_RULES.map((r) => {
                    const ok = r.test(form.password);
                    return (
                      <div key={r.key} className={`flex items-center gap-2 ${ok ? 'text-success' : 'text-neutral-600'}`}>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!!errors.password && <p className="-mt-3 text-xs text-error">{errors.password}</p>}

              <InputField label="Passwort bestätigen *" icon={Lock}>
                <input id="confirm-password" type={showConfirmPw ? 'text' : 'password'} value={form.confirmPassword} onChange={setValue('confirmPassword')} required placeholder="••••••••" className={errCls(PW_INPUT_CLS, errors.confirmPassword)} />
                <button type="button" onClick={() => setShowConfirmPw((s) => !s)} className="btn-link absolute right-3 top-1/2 -translate-y-1/2 p-1">
                  {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </InputField>
              {!!errors.confirmPassword && <p className="-mt-3 text-xs text-error">{errors.confirmPassword}</p>}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField label="Telefon" icon={Phone}>
                  <input id="phone" type="tel" value={form.phone} onChange={setValue('phone')} placeholder="+49 123 456789" className={errCls(INPUT_CLS, errors.phone)} />
                </InputField>
                <InputField label={`Postleitzahl ${role === 'helper' ? '*' : ''}`} icon={MapPin}>
                  <input id="zipCode" type="text" value={form.zipCode} onChange={setValue('zipCode')} required={role === 'helper'} pattern="[0-9]{5}" placeholder="10115" className={errCls(INPUT_CLS, errors.zipCode)} />
                </InputField>
              </div>
              {(errors.phone || errors.zipCode) && <p className="-mt-3 text-xs text-error">{errors.phone || errors.zipCode}</p>}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InputField label={`Stadt ${role === 'helper' ? '*' : ''}`} icon={MapPin}>
                  <input id="city" type="text" value={form.city} onChange={setValue('city')} required={role === 'helper'} placeholder="München" className={errCls(INPUT_CLS, errors.city)} />
                </InputField>
                <InputField label={`Straße ${role === 'helper' ? '*' : ''}`} icon={MapPin}>
                  <input id="street" type="text" value={form.street} onChange={setValue('street')} required={role === 'helper'} placeholder="Musterstraße" className={errCls(INPUT_CLS, errors.street)} />
                </InputField>
                <InputField label={`Hausnummer ${role === 'helper' ? '*' : ''}`} icon={MapPin}>
                  <input id="streetNumber" type="text" value={form.streetNumber} onChange={setValue('streetNumber')} required={role === 'helper'} placeholder="12A" className={errCls(INPUT_CLS, errors.streetNumber)} />
                </InputField>
              </div>
              {(errors.city || errors.street || errors.streetNumber) && <p className="-mt-3 text-xs text-error">{errors.city || errors.street || errors.streetNumber}</p>}

              {role === 'helper' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-100 mb-2">Fähigkeiten *</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className={`btn-base px-4 py-2 rounded-lg text-sm font-medium transition-all ${form.skills.includes(s) ? 'btn-secondary text-white' : 'btn-ghost'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {!!errors.skills && <p className="text-xs text-error mt-2">{errors.skills}</p>}
                </div>
              )}

              <label className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                <input type="checkbox" checked={form.acceptTerms} onChange={setValue('acceptTerms')} className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span>Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung.</span>
              </label>
              {!!errors.acceptTerms && <p className="-mt-3 text-xs text-error">{errors.acceptTerms}</p>}

              <button type="submit" disabled={loading} className="btn-base btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Registrierung wird vorbereitet...</>
                  : 'Konto erstellen und E-Mail bestätigen'}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerify} className="space-y-5">
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <p className="text-sm text-primary-800">
                  Wir haben einen Bestätigungscode an <strong>{form.email}</strong> gesendet.
                  {expiresAt ? ` Der Code ist bis ${new Date(expiresAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} gültig.` : ''}
                </p>
                {!!developmentCode && <p className="mt-2 text-xs text-primary-700">Entwicklungsmodus: Testcode <strong>{developmentCode}</strong></p>}
              </div>

              <InputField label="Bestätigungscode *" icon={Mail}>
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (errors.verificationCode) setErrors((p) => ({ ...p, verificationCode: undefined }));
                  }}
                  required
                  placeholder="123456"
                  className={errCls(INPUT_CLS, errors.verificationCode)}
                />
              </InputField>
              {!!errors.verificationCode && <p className="-mt-3 text-xs text-error">{errors.verificationCode}</p>}

              <button type="submit" disabled={verifyLoading || verificationCode.length !== 6} className="btn-base btn-primary w-full py-3 flex items-center justify-center gap-2">
                {verifyLoading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Code wird überprüft...</>
                  : 'E-Mail bestätigen und Konto aktivieren'}
              </button>

              <button type="button" onClick={resendCode} disabled={!!resendCooldown || loading} className="btn-base btn-ghost w-full py-3 disabled:text-neutral-400 disabled:border-neutral-200 flex items-center justify-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                {resendCooldown ? `Code erneut senden in ${resendCooldown}s` : 'Code erneut senden'}
              </button>

              <button type="button" onClick={() => setStep('form')} className="w-full text-sm btn-link font-medium">
                Angaben anpassen
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button onClick={onBackToLogin} className="text-sm btn-link font-medium">
              ← Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


