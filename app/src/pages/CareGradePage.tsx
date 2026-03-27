import React from 'react';
import { User, CareGrade } from '../types';
import { CareGradeProfile } from '../components/CareGradeProfile';

interface CareGradePageProps {
  user: User;
}

export function CareGradePage({ user }: CareGradePageProps) {
  const handleUpdateCareGrade = (grade: CareGrade) => {
    alert(`Pflegegrad ${grade} wurde gespeichert`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pflegegrad</h1>
        <p className="text-neutral-600">Definieren Sie Ihren Pflegegrad</p>
      </div>

      <CareGradeProfile careGrade={user.careGrade} onUpdateCareGrade={handleUpdateCareGrade} />
    </div>
  );
}
