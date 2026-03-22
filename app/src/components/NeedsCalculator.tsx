import React, { useState, useMemo } from 'react';
import { CareGrade, CareService, PaymentSource } from '../types';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { CARE_SERVICES } from './CareGradeProfile';

interface NeedsCalculatorProps {
  careGrade?: CareGrade;
  onApplyAllocation?: (allocation: AllocationResult[]) => void;
}

interface AllocationResult {
  service: CareService;
  allocatedAmount: number;
  allocatedHours: number;
  remainingAmount: number;
}

export function NeedsCalculator({ careGrade, onApplyAllocation }: NeedsCalculatorProps) {
  const [monthlyHours, setMonthlyHours] = useState<number>(0);
  const [preferredRate, setPreferredRate] = useState<number>(30);
  
  // Get available services for current care grade
  const availableServices = useMemo(() => {
    if (!careGrade) return [];
    return CARE_SERVICES
      .filter(s => s.careGrades.includes(careGrade))
      .sort((a, b) => a.priority - b.priority);
  }, [careGrade]);
  
  // Calculate intelligent allocation
  const allocation = useMemo((): AllocationResult[] => {
    if (!careGrade || monthlyHours <= 0) return [];
    
    const results: AllocationResult[] = [];
    let remainingHours = monthlyHours;
    let totalCost = monthlyHours * preferredRate;
    
    // Sort services by priority
    const sortedServices = [...availableServices].sort((a, b) => a.priority - b.priority);
    
    for (const service of sortedServices) {
      if (remainingHours <= 0) break;
      if (service.hourlyRate === 0) continue; // Skip services without hourly rate
      
      // Calculate how many hours this service can cover
      const maxHoursByAmount = service.maxAmount / service.hourlyRate;
      const hoursToAllocate = Math.min(remainingHours, maxHoursByAmount);
      const amountToAllocate = hoursToAllocate * service.hourlyRate;
      
      if (hoursToAllocate > 0) {
        results.push({
          service,
          allocatedHours: hoursToAllocate,
          allocatedAmount: amountToAllocate,
          remainingAmount: service.maxAmount - amountToAllocate,
        });
        
        remainingHours -= hoursToAllocate;
        totalCost -= amountToAllocate;
      }
    }
    
    // If still hours remaining, suggest Selbstzahler
    if (remainingHours > 0) {
      const selbstzahlerCost = remainingHours * preferredRate;
      results.push({
        service: {
          id: 'selbstzahler',
          name: 'Selbstzahler (Restbetrag)',
          paymentSource: 'selbstzahler',
          careGrades: [1, 2, 3, 4, 5],
          maxAmount: 999999,
          hourlyRate: preferredRate,
          priority: 999,
          description: 'Restliche Stunden werden privat bezahlt',
        },
        allocatedHours: remainingHours,
        allocatedAmount: selbstzahlerCost,
        remainingAmount: 0,
      });
    }
    
    return results;
  }, [careGrade, monthlyHours, preferredRate, availableServices]);
  
  const totalAllocated = allocation.reduce((sum, a) => sum + a.allocatedAmount, 0);
  const totalHours = allocation.reduce((sum, a) => sum + a.allocatedHours, 0);
  const isFulfilledByInsurance = allocation.every(a => a.service.paymentSource !== 'selbstzahler');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-400 to-accent-500 text-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Calculator className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Bedarfsermittlung</h2>
            <p className="text-white/90 text-sm">Automatische Optimierung Ihrer Zahlungsaufteilung</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Ihren Hilfebedarf angeben</h3>
        
        {!careGrade && (
          <div className="mb-4 flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/30">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-warning-dark">
              <p className="font-medium">Bitte wählen Sie zuerst Ihren Pflegegrad aus</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Monatlicher Bedarf (Stunden)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="z.B. 5"
              disabled={!careGrade}
            />
            <p className="text-xs text-neutral-500 mt-1">Wie viele Stunden Hilfe benötigen Sie pro Monat?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Bevorzugter Stundensatz (€)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={preferredRate}
              onChange={(e) => setPreferredRate(parseFloat(e.target.value) || 30)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="z.B. 30"
              disabled={!careGrade}
            />
            <p className="text-xs text-neutral-500 mt-1">Durchschnittlicher Stundensatz für Helper</p>
          </div>
        </div>
      </div>

      {/* Results */}
      {allocation.length > 0 && (
        <>
          {/* Summary Card */}
          <div className={`rounded-xl p-6 border-2 ${
            isFulfilledByInsurance 
              ? 'bg-success/10 border-success' 
              : 'bg-warning/10 border-warning'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isFulfilledByInsurance ? 'bg-success/20' : 'bg-warning/20'}`}>
                {isFulfilledByInsurance ? (
                  <CheckCircle className="w-8 h-8 text-success" />
                ) : (
                  <Lightbulb className="w-8 h-8 text-warning" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${isFulfilledByInsurance ? 'text-success' : 'text-warning'}`}>
                  {isFulfilledByInsurance 
                    ? 'Vollständig durch Pflegeleistungen abgedeckt!' 
                    : 'Teilweise Selbstzahlung erforderlich'}
                </h3>
                <p className="text-neutral-700">
                  {isFulfilledByInsurance
                    ? `Ihr Bedarf von ${totalHours.toFixed(1)} Stunden kann komplett über Pflegeleistungen finanziert werden.`
                    : `Von ${totalHours.toFixed(1)} Stunden sind ${allocation.filter(a => a.service.paymentSource !== 'selbstzahler').reduce((sum, a) => sum + a.allocatedHours, 0).toFixed(1)} Stunden über Pflegeleistungen abgedeckt. Der Rest wird privat bezahlt.`
                  }
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Gesamtkosten</p>
                    <p className="text-2xl font-bold text-neutral-900">{totalAllocated.toFixed(2)} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Stunden gesamt</p>
                    <p className="text-2xl font-bold text-neutral-900">{totalHours.toFixed(1)} h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Empfohlene Zahlungsaufteilung</h3>
            
            <div className="space-y-4">
              {allocation.map((item, index) => (
                <div 
                  key={item.service.id}
                  className="p-5 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded">
                          Priorität {item.service.priority}
                        </span>
                        <h4 className="font-bold text-neutral-900">{item.service.name}</h4>
                      </div>
                      <p className="text-sm text-neutral-600">{item.service.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Zugewiesen</p>
                      <p className="text-lg font-bold text-primary-700">{item.allocatedHours.toFixed(1)} h</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Kosten</p>
                      <p className="text-lg font-bold text-neutral-900">{item.allocatedAmount.toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Verbleibend</p>
                      <p className="text-lg font-bold text-neutral-500">{item.remainingAmount.toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.service.paymentSource === 'selbstzahler' 
                            ? 'bg-warning' 
                            : 'bg-primary-600'
                        }`}
                        style={{ 
                          width: `${item.service.maxAmount > 0 ? (item.allocatedAmount / item.service.maxAmount) * 100 : 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Button */}
            {onApplyAllocation && (
              <button
                onClick={() => onApplyAllocation(allocation)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                Diese Aufteilung verwenden
              </button>
            )}
          </div>

          {/* How it Works */}
          <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="text-lg font-bold text-primary-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              So funktioniert die automatische Aufteilung
            </h3>
            <ul className="space-y-2 text-sm text-primary-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 flex-shrink-0">1.</span>
                <span>Das System nutzt zuerst die Leistungen mit der <strong>höchsten Priorität</strong> (niedrigste Nummer)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 flex-shrink-0">2.</span>
                <span>Jede Leistung wird bis zu ihrem <strong>Maximum</strong> ausgeschöpft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 flex-shrink-0">3.</span>
                <span>Übrige Stunden werden als <strong>Selbstzahler</strong> markiert</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 flex-shrink-0">4.</span>
                <span>Sie können die Aufteilung jederzeit <strong>manuell anpassen</strong></span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
