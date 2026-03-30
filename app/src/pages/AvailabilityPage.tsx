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
  const today = new Date().getDay();
  const todaysSlots = userSlots.filter(slot => slot.dayOfWeek === today);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white/85 p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Verfügbarkeit</h1>
        <p className="text-neutral-600">Legen Sie Ihre verfügbaren Zeitfenster mit klarer Tagesübersicht fest</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Heute</p>
            <p className="text-2xl font-bold text-neutral-900">{todaysSlots.length}</p>
            <p className="text-sm text-neutral-600">Zeitfenster eingetragen</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Insgesamt</p>
            <p className="text-2xl font-bold text-neutral-900">{userSlots.length}</p>
            <p className="text-sm text-neutral-600">aktive Slots gespeichert</p>
          </div>
        </div>
      </div>

      <AvailabilityManager
        userId={user.id}
        slots={userSlots}
        onSave={onUpdateAvailability}
      />
    </div>
  );
}
