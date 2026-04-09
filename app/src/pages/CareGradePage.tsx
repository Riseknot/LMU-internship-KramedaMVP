import React from 'react';
import { User, CareGrade } from '../types';
import { CareGradeProfile } from '../components/CareGradeProfile';
import { PageShell, SectionCard } from '../components/PageShell';

interface CareGradePageProps {
  user: User;
}

export function CareGradePage({ user }: CareGradePageProps) {
  const handleUpdateCareGrade = (grade: CareGrade) => {
    alert(`Pflegegrad ${grade} wurde gespeichert`);
  };

  return (
    <PageShell
      eyebrow="Pflege"
      title="Pflegegrad"
      description="Pflegestufe verständlich erfassen und aktuell halten."
      metrics={[
        { label: 'Aktuell', value: user.careGrade ?? '-', hint: 'gespeicherter Pflegegrad', tone: 'primary' },
      ]}
    >
      <SectionCard title="Pflegeprofil" description="Halten Sie den aktuellen Pflegegrad konsistent und nachvollziehbar fest.">
        <CareGradeProfile careGrade={user.careGrade} onUpdateCareGrade={handleUpdateCareGrade} />
      </SectionCard>
    </PageShell>
  );
}
