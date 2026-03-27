import React from 'react';
import { User } from '../types';
import { GamificationPanel } from '../components/GamificationPanel';

interface GamificationPageProps {
  user: User;
}

export function GamificationPage({ user }: GamificationPageProps) {
  if (!user.gamification) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-2">Erfolge</h1>
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-500">Gamification-Daten nicht verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Erfolge</h1>
        <p className="text-neutral-600">Ihre Fortschritte und Erreichungen</p>
      </div>

      <GamificationPanel gamification={user.gamification} userName={user.firstname} />
    </div>
  );
}
