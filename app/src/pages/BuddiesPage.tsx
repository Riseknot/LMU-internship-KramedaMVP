import React from 'react';
import { User, BuddyRelationship } from '../types';
import { BuddyManagement } from '../components/BuddyManagement';
import { PageShell, SectionCard } from '../components/PageShell';

interface BuddiesPageProps {
  user: User;
  users: User[];
  buddyRelationships: BuddyRelationship[];
}

export function BuddiesPage({ user, users, buddyRelationships }: BuddiesPageProps) {
  return (
    <PageShell
      eyebrow="Community"
      title="Buddy-Management"
      description="Beziehungen und Zusammenarbeit klar und ohne visuelle Unruhe organisieren."
      metrics={[
        { label: 'Buddies', value: buddyRelationships.length, hint: 'aktive Verbindungen', tone: 'primary' },
        { label: 'Kontakte', value: users.length, hint: 'im Netzwerk', tone: 'neutral' },
      ]}
    >
      <SectionCard title="Beziehungsübersicht" description="Anfragen, Pausen und Auto-Assign an einem Ort steuern.">
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
      </SectionCard>
    </PageShell>
  );
}
