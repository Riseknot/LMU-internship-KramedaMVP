import React from 'react';
import { CareGrade, CareService } from '../types';
import { Shield, Info, CheckCircle } from 'lucide-react';

interface CareGradeProfileProps {
  careGrade?: CareGrade;
  onUpdateCareGrade: (grade: CareGrade) => void;
}

// Care services configuration based on Pflegegrad
const CARE_SERVICES: CareService[] = [
  {
    id: '1',
    name: 'Entlastungsbetrag',
    paymentSource: 'entlastungsbetrag',
    careGrades: [1, 2, 3, 4, 5],
    maxAmount: 125,
    hourlyRate: 30,
    priority: 1,
    description: 'Monatlicher Zuschuss zur Entlastung pflegender Angehöriger',
  },
  {
    id: '2',
    name: 'Pflegesachleistung (Grad 2)',
    paymentSource: 'pflegesachleistung',
    careGrades: [2],
    maxAmount: 724,
    hourlyRate: 35,
    priority: 2,
    description: 'Professionelle ambulante Pflege durch Pflegedienste',
  },
  {
    id: '3',
    name: 'Pflegesachleistung (Grad 3)',
    paymentSource: 'pflegesachleistung',
    careGrades: [3],
    maxAmount: 1363,
    hourlyRate: 35,
    priority: 2,
    description: 'Professionelle ambulante Pflege durch Pflegedienste',
  },
  {
    id: '4',
    name: 'Pflegesachleistung (Grad 4)',
    paymentSource: 'pflegesachleistung',
    careGrades: [4],
    maxAmount: 1693,
    hourlyRate: 35,
    priority: 2,
    description: 'Professionelle ambulante Pflege durch Pflegedienste',
  },
  {
    id: '5',
    name: 'Pflegesachleistung (Grad 5)',
    paymentSource: 'pflegesachleistung',
    careGrades: [5],
    maxAmount: 2095,
    hourlyRate: 35,
    priority: 2,
    description: 'Professionelle ambulante Pflege durch Pflegedienste',
  },
  {
    id: '6',
    name: 'Verhinderungspflege',
    paymentSource: 'verhinderungspflege',
    careGrades: [2, 3, 4, 5],
    maxAmount: 1612,
    hourlyRate: 30,
    priority: 3,
    description: 'Ersatzpflege wenn Pflegeperson verhindert ist (jährlich)',
  },
  {
    id: '7',
    name: 'Kurzzeitpflege',
    paymentSource: 'kurzzeitpflege',
    careGrades: [2, 3, 4, 5],
    maxAmount: 1774,
    hourlyRate: 0,
    priority: 4,
    description: 'Vorübergehende vollstationäre Pflege (jährlich)',
  },
  {
    id: '8',
    name: 'Zusätzliche Betreuungsleistungen',
    paymentSource: 'zusatzbetreuung',
    careGrades: [1, 2, 3, 4, 5],
    maxAmount: 125,
    hourlyRate: 25,
    priority: 5,
    description: 'Zusätzliche Betreuung und Aktivierung',
  },
];

export function CareGradeProfile({ careGrade, onUpdateCareGrade }: CareGradeProfileProps) {
  const availableServices = careGrade 
    ? CARE_SERVICES.filter(s => s.careGrades.includes(careGrade))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-br from-primary-700 via-primary-800 to-primary-900 text-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Pflegegrad-Profil</h2>
            <p className="text-primary-100 text-sm">Automatische Berechnung Ihrer Pflegeleistungen</p>
          </div>
        </div>
      </div>

      {/* Care Grade Selection */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Pflegegrad auswählen</h3>
        <div className="grid grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as CareGrade[]).map(grade => (
            <button
              key={grade}
              onClick={() => onUpdateCareGrade(grade)}
              className={`py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                careGrade === grade
                  ? 'bg-linear-to-br from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-102'
              }`}
            >
              Grad {grade}
            </button>
          ))}
        </div>

        {!careGrade && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
            <div className="text-sm text-primary-900">
              <p className="font-medium mb-1">Bitte wählen Sie Ihren Pflegegrad</p>
              <p className="text-primary-700">
                Basierend auf Ihrem Pflegegrad zeigen wir Ihnen alle verfügbaren Pflegeleistungen und deren Beträge an.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Services */}
      {careGrade && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Verfügbare Pflegeleistungen für Pflegegrad {careGrade}
          </h3>
          
          <div className="space-y-4">
            {availableServices.map(service => (
              <div 
                key={service.id}
                className="p-5 bg-linear-to-br from-neutral-50 to-white rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900">{service.name}</h4>
                      <p className="text-sm text-neutral-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-700">
                      {service.maxAmount.toFixed(2)} €
                    </p>
                    {service.hourlyRate > 0 && (
                      <p className="text-sm text-neutral-500">
                        {service.hourlyRate} €/h
                      </p>
                    )}
                  </div>
                </div>
                
                {service.maxHours && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                      Max. Stunden: <span className="font-semibold text-neutral-900">{service.maxHours} h</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-5 bg-linear-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700 mb-1">Gesamt verfügbar (monatlich)</p>
                <p className="text-xs text-primary-600">Entlastungsbetrag + Pflegesachleistung</p>
              </div>
              <p className="text-3xl font-bold text-primary-900">
                {availableServices
                  .filter(s => s.paymentSource === 'entlastungsbetrag' || s.paymentSource === 'pflegesachleistung')
                  .reduce((sum, s) => sum + s.maxAmount, 0)
                  .toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-900 mb-3">Hinweise zu Pflegeleistungen</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span>Der <strong>Entlastungsbetrag</strong> (125 €) steht allen Pflegegraden zur Verfügung</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span><strong>Pflegesachleistungen</strong> sind ab Pflegegrad 2 verfügbar und steigen mit jedem Grad</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span><strong>Verhinderungs-</strong> und <strong>Kurzzeitpflege</strong> sind jährliche Budgets</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span>Beträge können kombiniert werden, um Ihren individuellen Bedarf abzudecken</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { CARE_SERVICES };

