import React, { useState } from 'react';
import { CareFinance, CostEntry } from '../types';
import { Euro, Edit2, Plus, TrendingUp, AlertCircle, Check, X } from 'lucide-react';

interface CareFinanceOverviewProps {
  finances: CareFinance[];
  costEntries: CostEntry[];
  coordinatorId: string;
  onUpdateFinance: (finance: CareFinance) => void;
  onAddCostEntry: (entry: CostEntry) => void;
}

export function CareFinanceOverview({
  finances,
  costEntries,
  coordinatorId,
  onUpdateFinance,
  onAddCostEntry,
}: CareFinanceOverviewProps) {
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CareFinance | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentFinance = finances.find(f => f.month === currentMonth) || {
    id: `finance-${Date.now()}`,
    coordinatorId,
    month: currentMonth,
    pflegesachleistung: 0,
    pflegegeld: 0,
    verhinderungspflege: 0,
    kurzzeitpflege: 0,
    zusatzbetreuung: 0,
    notes: '',
    updatedAt: new Date().toISOString(),
  };

  const currentMonthCosts = costEntries.filter(
    e => e.date.startsWith(currentMonth) && e.coordinatorId === coordinatorId
  );

  const totalBudget = 
    currentFinance.pflegesachleistung +
    currentFinance.pflegegeld +
    currentFinance.verhinderungspflege +
    currentFinance.kurzzeitpflege +
    currentFinance.zusatzbetreuung;

  const totalSpent = currentMonthCosts.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const usagePercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleEdit = (finance: CareFinance) => {
    setEditingMonth(finance.month);
    setEditForm({ ...finance });
  };

  const handleSave = () => {
    if (editForm) {
      onUpdateFinance({
        ...editForm,
        updatedAt: new Date().toISOString(),
      });
      setEditingMonth(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingMonth(null);
    setEditForm(null);
  };

  const budgetItems = [
    { key: 'pflegesachleistung', label: 'Pflegesachleistung', color: 'primary' },
    { key: 'pflegegeld', label: 'Pflegegeld', color: 'accent' },
    { key: 'verhinderungspflege', label: 'Verhinderungspflege', color: 'success' },
    { key: 'kurzzeitpflege', label: 'Kurzzeitpflege', color: 'warning' },
    { key: 'zusatzbetreuung', label: 'Zusätzliche Betreuung', color: 'neutral' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Euro className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-neutral-600">Verfügbares Budget</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{totalBudget.toFixed(2)} €</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <span className="text-sm text-neutral-600">Ausgegeben</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{totalSpent.toFixed(2)} €</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${remaining >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
              <AlertCircle className={`w-5 h-5 ${remaining >= 0 ? 'text-success' : 'text-error'}`} />
            </div>
            <span className="text-sm text-neutral-600">Verbleibend</span>
          </div>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
            {remaining.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700">Budget-Auslastung</span>
          <span className="text-sm font-semibold text-neutral-900">{usagePercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              usagePercent <= 70 ? 'bg-success' : usagePercent <= 90 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget Configuration */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">
            Pflegebudget für {new Date(currentMonth + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </h3>
          {editingMonth !== currentMonth && (
            <button
              onClick={() => handleEdit(currentFinance)}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Bearbeiten
            </button>
          )}
        </div>

        {editingMonth === currentMonth && editForm ? (
          <div className="space-y-4">
            {budgetItems.map(item => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {item.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={editForm[item.key as keyof CareFinance] as number}
                    onChange={(e) => setEditForm({ ...editForm, [item.key]: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">€</span>
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Notizen
              </label>
              <textarea
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Zusätzliche Notizen..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Speichern
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgetItems.map(item => {
              const value = currentFinance[item.key as keyof CareFinance] as number;
              return (
                <div key={item.key} className="p-4 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600 block mb-1">{item.label}</span>
                  <span className="text-xl font-semibold text-neutral-900">{value.toFixed(2)} €</span>
                </div>
              );
            })}
          </div>
        )}

        {currentFinance.notes && editingMonth !== currentMonth && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-600 block mb-1">Notizen</span>
            <p className="text-sm text-neutral-900">{currentFinance.notes}</p>
          </div>
        )}
      </div>

      {/* Recent Costs */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Ausgaben diesen Monat</h3>
          <span className="text-sm text-neutral-600">{currentMonthCosts.length} Einträge</span>
        </div>

        {currentMonthCosts.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            Noch keine Ausgaben erfasst
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthCosts.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{entry.description}</p>
                  <p className="text-xs text-neutral-600">
                    {new Date(entry.date).toLocaleDateString('de-DE')} · {entry.category}
                  </p>
                </div>
                <span className="ml-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">
                  {entry.amount.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
