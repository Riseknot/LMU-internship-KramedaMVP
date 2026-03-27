import React from 'react';
import { User } from '../types';
import { NeedsCalculator } from '../components/NeedsCalculator';

interface NeedsCalculatorPageProps {
  user: User;
}

export function NeedsCalculatorPage({ user }: NeedsCalculatorPageProps) {
  const handleApplyAllocation = (allocation: any) => {
    alert('Zahlungsaufteilung wurde übernommen!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bedarfsermittlung</h1>
        <p className="text-neutral-600">Führen Sie eine Bedarfsanalyse durch</p>
      </div>

      <NeedsCalculator careGrade={user.careGrade} onApplyAllocation={handleApplyAllocation} />
    </div>
  );
}
