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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Helper Übersicht</h1>
          <p className="text-neutral-600">Finden Sie die passenden Helper für Ihre Aufträge</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'map'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
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
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden" style={{ height: '600px' }}>
          <MapView currentUser={user} helpers={helpers} assignments={assignments} />
        </div>
      )}
    </div>
  );
}
