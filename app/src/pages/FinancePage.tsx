import React from 'react';
import { User, CareFinance, CostEntry } from '../types';
import { CareFinanceOverview } from '../components/CareFinanceOverview';
import { PageShell, SectionCard } from '../components/PageShell';

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
    <PageShell
      eyebrow="Finanzen"
      title="Kostenübersicht"
      description="Budget und Ausgaben in einer ruhigeren, klaren Übersicht verwalten."
      metrics={[
        { label: 'Budgets', value: finances.length, hint: 'aktive Pläne', tone: 'primary' },
        { label: 'Einträge', value: costEntries.length, hint: 'erfasste Kosten', tone: 'accent' },
      ]}
    >
      <SectionCard title="Finanz-Cockpit" description="Alle relevanten Positionen sauber an einem Ort.">
        <CareFinanceOverview
          finances={finances}
          costEntries={costEntries}
          coordinatorId={user.id}
          onUpdateFinance={onUpdateFinance}
          onAddCostEntry={onAddCostEntry}
        />
      </SectionCard>
    </PageShell>
  );
}
