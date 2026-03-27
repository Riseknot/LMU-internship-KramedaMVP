import React from 'react';
import { User, SocialFundContribution } from '../types';
import { SocialFundOverview } from '../components/SocialFundOverview';

interface SocialFundPageProps {
  user: User;
  contributions: SocialFundContribution[];
}

export function SocialFundPage({ user, contributions }: SocialFundPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sozialfond</h1>
        <p className="text-neutral-600">Übersicht über Sozialfond-Beiträge</p>
      </div>

      <SocialFundOverview
        coordinatorId={user.id}
        contributions={contributions}
        users={[]}
        onViewProfile={(userId) => alert(`Profil ${userId} wird angezeigt`)}
      />
    </div>
  );
}
