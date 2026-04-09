import React from 'react';
import { User } from '../types';
import { GamificationPanel } from '../components/GamificationPanel';
import { PageShell, SectionCard } from '../components/PageShell';

interface GamificationPageProps {
  user: User;
}

export function GamificationPage({ user }: GamificationPageProps) {
  if (!user.gamification) {
    return (
      <PageShell
        eyebrow="Motivation"
        title="Erfolge"
        description="Sobald Fortschritte vorliegen, erscheinen sie hier in einer übersichtlichen Ansicht."
      >
        <SectionCard className="text-center">
          <p className="text-neutral-500">Gamification-Daten nicht verfügbar</p>
        </SectionCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Motivation"
      title="Erfolge"
      description="Fortschritt und Anerkennung kompakt und visuell ruhiger dargestellt."
      metrics={[
        { label: 'Level', value: user.gamification.level, hint: 'aktueller Rang', tone: 'primary' },
        { label: 'Punkte', value: user.gamification.points, hint: 'gesammelt', tone: 'success' },
      ]}
    >
      <SectionCard title="Fortschritt" description="Alle Erfolge und Meilensteine an einem Ort.">
        <GamificationPanel gamification={user.gamification} userName={user.firstname} />
      </SectionCard>
    </PageShell>
  );
}
