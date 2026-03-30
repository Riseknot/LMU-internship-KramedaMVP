import React, { useState } from 'react';
import { User, AvailabilitySlot } from '../types';
import { HelperListView } from '../components/HelperListView';
import { MapView } from '../components/MapView';
import { Map as MapIcon, List } from 'lucide-react';
import { Assignment } from '../types';

interface HelpersPageProps {
  user: User;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  assignments: Assignment[];
}

export function HelpersPage({
  user,
  helpers,
  availabilitySlots,
  assignments,
}: HelpersPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">Helper Übersicht</h1>
          <p className="text-neutral-600">Airbnb-Listing trifft auf Uber-Karte: ruhig suchen, schnell entscheiden.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'list'
                ? 'btn-secondary text-white'
                : 'btn-ghost'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'map'
                ? 'btn-secondary text-white'
                : 'btn-ghost'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Karte
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <HelperListView
          helpers={helpers}
          currentUser={user}
          onSendMessage={(helperId) => alert(`Nachricht an ${helperId}`)}
          onProposeAssignment={(helperId) => alert(`Auftrag an ${helperId} vorgeschlagen`)}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950" style={{ height: '600px' }}>
          <MapView currentUser={user} helpers={helpers} assignments={assignments} />
        </div>
      )}
    </div>
  );
}
