import React from 'react';
import { User, CareFinance, CostEntry } from '../types';
import { CareFinanceOverview } from '../components/CareFinanceOverview';

interface FinancePageProps {
  user: User;
  finances: CareFinance[];
  costEntries: CostEntry[];
  onUpdateFinance: (finance: CareFinance) => void;
  onAddCostEntry: (entry: CostEntry) => void;
}

export function FinancePage({
  user,
  finances,
  costEntries,
  onUpdateFinance,
  onAddCostEntry,
}: FinancePageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kostenübersicht</h1>
        <p className="text-neutral-600">Verwalten Sie Ihr Pflegebudget und Ausgaben</p>
      </div>

      <CareFinanceOverview
        finances={finances}
        costEntries={costEntries}
        coordinatorId={user.id}
        onUpdateFinance={onUpdateFinance}
        onAddCostEntry={onAddCostEntry}
      />
    </div>
  );
}
