import React from 'react';
import { User, SocialFundContribution } from '../types';
import { SocialFundOverview } from '../components/SocialFundOverview';
import { PageShell, SectionCard } from '../components/PageShell';

interface SocialFundPageProps {
  user: User;
  contributions: SocialFundContribution[];
}

export function SocialFundPage({ user, contributions }: SocialFundPageProps) {
  return (
    <PageShell
      eyebrow="Support"
      title="Sozialfond"
      description="Beiträge und Unterstützungen in einer klareren Übersicht anzeigen."
      metrics={[
        { label: 'Beiträge', value: contributions.length, hint: 'erfasste Vorgänge', tone: 'success' },
        { label: 'Profil', value: user.firstname, hint: 'aktiver Bereich', tone: 'neutral' },
      ]}
    >
      <SectionCard title="Übersicht Sozialfond" description="Alle relevanten Einzahlungen und Unterstützungen transparent dargestellt.">
        <SocialFundOverview
          coordinatorId={user.id}
          contributions={contributions}
          users={[]}
          onViewProfile={(userId) => alert(`Profil ${userId} wird angezeigt`)}
        />
      </SectionCard>
    </PageShell>
  );
}
