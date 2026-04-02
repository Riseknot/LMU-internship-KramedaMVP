import React from 'react';
import { User, Assignment } from '../types';
import { MapView } from './findHelper/components/MapView';
import { PageShell, SectionCard } from '../components/PageShell';

interface MapPageProps {
  user: User;
  users: User[];
  assignments: Assignment[];
}

export function MapPage({ user, users, assignments }: MapPageProps) {
  const helpers = users.filter(u => u.role === 'helper');

  return (
    <PageShell
      eyebrow="Karte"
      title="GPS-Karte"
      description="Helper und Aufträge in der Umgebung in einer fokussierten Kartenansicht vergleichen."
      metrics={[
        { label: 'Helper', value: helpers.length, hint: 'sichtbar', tone: 'primary' },
        { label: 'Aufträge', value: assignments.length, hint: 'in Reichweite', tone: 'accent' },
      ]}
    >
      <SectionCard title="Standortübersicht" description="Eine große, ruhige Kartenfläche für schnelles Matching." className="overflow-hidden" bodyClassName="overflow-hidden rounded-2xl">
        <div className="overflow-hidden rounded-2xl" style={{ height: '600px' }}>
          <MapView currentUser={user} helpers={helpers} assignments={assignments} />
        </div>
      </SectionCard>
    </PageShell>
  );
}
