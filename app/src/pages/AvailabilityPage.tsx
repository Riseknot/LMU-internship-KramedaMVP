import React from 'react';
import { User, AvailabilitySlot } from '../types';
import { AvailabilityManager } from '../components/AvailabilityManager';
import { PageShell, SectionCard } from '../components/PageShell';

interface AvailabilityPageProps {
  user: User;
  availabilitySlots: AvailabilitySlot[];
  onUpdateAvailability: (slots: AvailabilitySlot[]) => void;
}

export function AvailabilityPage({
  user,
  availabilitySlots,
  onUpdateAvailability,
}: AvailabilityPageProps) {
  const userSlots = availabilitySlots.filter(slot => slot.userId === user.id);
  const today = new Date().getDay();
  const todaysSlots = userSlots.filter(slot => slot.dayOfWeek === today);

  return (
    <PageShell
      eyebrow="Planung"
      title="Verfügbarkeit"
      description="Zeitfenster entspannt pflegen und Engpässe schneller erkennen."
      metrics={[
        { label: 'Heute', value: todaysSlots.length, hint: 'eingetragene Fenster', tone: 'accent' },
        { label: 'Insgesamt', value: userSlots.length, hint: 'aktive Slots', tone: 'primary' },
      ]}
    >
      <SectionCard title="Wochenübersicht" description="Bearbeiten Sie Ihre Verfügbarkeit in einem klaren Flow.">
        <AvailabilityManager
          userId={user.id}
          slots={userSlots}
          onSave={onUpdateAvailability}
        />
      </SectionCard>
    </PageShell>
  );
}
