import React from 'react';
import { User } from '../types';
import { NeedsCalculator } from '../components/NeedsCalculator';
import { PageShell, SectionCard } from '../components/PageShell';

interface NeedsCalculatorPageProps {
  user: User;
}

export function NeedsCalculatorPage({ user }: NeedsCalculatorPageProps) {
  const handleApplyAllocation = (allocation: any) => {
    alert('Zahlungsaufteilung wurde übernommen!');
  };

  return (
    <PageShell
      eyebrow="Analyse"
      title="Bedarfsermittlung"
      description="Bedarf strukturierter erfassen und direkt in eine sinnvolle Planung überführen."
      metrics={[
        { label: 'Pflegegrad', value: user.careGrade ?? '-', hint: 'Ausgangsbasis', tone: 'primary' },
      ]}
    >
      <SectionCard title="Analyse-Workflow" description="Eine ruhige, klare Einschätzung für den Pflegealltag.">
        <NeedsCalculator careGrade={user.careGrade} onApplyAllocation={handleApplyAllocation} />
      </SectionCard>
    </PageShell>
  );
}
