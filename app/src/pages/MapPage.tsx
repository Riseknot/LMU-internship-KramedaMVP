import React from 'react';
import { User, Assignment } from '../types';
import { MapView } from './findHelper/components/MapView';

interface MapPageProps {
  user: User;
  users: User[];
  assignments: Assignment[];
}

export function MapPage({ user, users, assignments }: MapPageProps) {
  const helpers = users.filter(u => u.role === 'helper');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">GPS-Karte</h1>
        <p className="text-neutral-600">Übersicht über Helper und Aufträge in Ihrer Nähe</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden" style={{ height: '600px' }}>
        <MapView currentUser={user} helpers={helpers} assignments={assignments} />
      </div>
    </div>
  );
}
