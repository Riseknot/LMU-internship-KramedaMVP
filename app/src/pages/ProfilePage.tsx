import React from 'react';
import { User } from '../types';
import MyProfile from './myprofile/MyProfile';
import { PageShell, SectionCard } from '../components/PageShell';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
}

export function ProfilePage({ user, onLogout, onUserUpdate }: ProfilePageProps) {
  return (
    <PageShell
      eyebrow="Account"
      title="Mein Profil"
      description="Persönliche Daten und Einstellungen in einem sauberen, hellen Bereich verwalten."
      metrics={[
        { label: 'Rolle', value: user.role === 'helper' ? 'Helfer:in' : 'Koordinator:in', tone: 'primary' },
        { label: 'Sprachen', value: user.languages?.length ?? 0, hint: 'hinterlegte Sprachen', tone: 'neutral' },
      ]}
    >
      <SectionCard title="Profilverwaltung" description="Aktualisieren Sie Ihre Angaben und Ihr Auftreten im Netzwerk.">
        <MyProfile user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />
      </SectionCard>
    </PageShell>
  );
}
