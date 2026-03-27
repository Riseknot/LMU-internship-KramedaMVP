import React from 'react';
import { User, BuddyRelationship } from '../types';
import { BuddyManagement } from '../components/BuddyManagement';

interface BuddiesPageProps {
  user: User;
  users: User[];
  buddyRelationships: BuddyRelationship[];
}

export function BuddiesPage({ user, users, buddyRelationships }: BuddiesPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Buddy-Management</h1>
        <p className="text-neutral-600">Verwalten Sie Ihre Buddy-Beziehungen</p>
      </div>

      <BuddyManagement
        currentUser={user}
        buddyRelationships={buddyRelationships}
        users={users}
        onAcceptBuddy={(buddyId) => alert(`Buddy ${buddyId} akzeptiert`)}
        onPauseBuddy={(buddyId) => alert(`Buddy ${buddyId} pausiert`)}
        onResumeBuddy={(buddyId) => alert(`Buddy ${buddyId} fortgesetzt`)}
        onEndBuddy={(buddyId) => {
          if (confirm('Beziehung wirklich beenden?')) alert(`Buddy ${buddyId} beendet`);
        }}
        onToggleAutoAssign={(buddyId, enabled) =>
          alert(`Auto-Assign für ${buddyId}: ${enabled ? 'aktiviert' : 'deaktiviert'}`)
        }
      />
    </div>
  );
}
