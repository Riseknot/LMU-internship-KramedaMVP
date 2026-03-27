import React from 'react';
import { User, AvailabilitySlot } from '../types';
import { AvailabilityManager } from '../components/AvailabilityManager';

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Verfügbarkeit</h1>
        <p className="text-neutral-600">Legen Sie Ihre verfügbaren Zeitfenster fest</p>
      </div>

      <AvailabilityManager
        userId={user.id}
        slots={userSlots}
        onSave={onUpdateAvailability}
      />
    </div>
  );
}
