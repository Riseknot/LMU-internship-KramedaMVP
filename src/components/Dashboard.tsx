import React from 'react';
import { Assignment } from '../types';
import { Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardProps {
  assignments: Assignment[];
  userId: string;
}

export function Dashboard({ assignments, userId }: DashboardProps) {
  const userAssignments = assignments.filter(a => a.helperId === userId);
  
  // Calculate monthly hours
  const currentMonth = new Date().getMonth();
  const monthlyAssignments = userAssignments.filter(a => {
    const assignmentMonth = new Date(a.startTime).getMonth();
    return assignmentMonth === currentMonth;
  });

  const totalHours = monthlyAssignments.reduce((sum, assignment) => {
    const start = new Date(assignment.startTime);
    const end = new Date(assignment.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  // Mock hourly rate
  const hourlyRate = 25; // €25 per hour
  const totalCost = totalHours * hourlyRate;

  const stats = [
    {
      label: 'Einsätze diesen Monat',
      value: monthlyAssignments.length,
      icon: Calendar,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Gesamtstunden',
      value: totalHours.toFixed(1),
      icon: Clock,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      label: 'Abgeschlossene Aufträge',
      value: userAssignments.filter(a => a.status === 'DONE').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Berechnete Kosten',
      value: `€${totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="text-neutral-600">Übersicht über Ihre Aktivitäten</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="font-semibold mb-4">Kostenberechnung</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Stundensatz:</span>
            <span className="font-medium">€{hourlyRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Gesamtstunden (aktueller Monat):</span>
            <span className="font-medium">{totalHours.toFixed(1)} h</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between">
            <span className="font-semibold">Gesamt:</span>
            <span className="text-xl font-bold text-primary-600">€{totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <p className="text-sm text-accent-900">
          <strong>Hinweis:</strong> Dies ist eine Simulation mit Beispieldaten. Echte Kosten können variieren.
        </p>
      </div>
    </div>
  );
}
