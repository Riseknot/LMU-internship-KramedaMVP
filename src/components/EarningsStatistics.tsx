import React, { useState, useMemo } from 'react';
import { HelperEarning, PaymentSource } from '../types';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EarningsStatisticsProps {
  earnings: HelperEarning[];
  helperId: string;
}

type TimeRange = 'day' | 'week' | 'month' | 'year';

const PAYMENT_SOURCE_COLORS: Record<PaymentSource, string> = {
  selbstzahler: '#3B82F6',
  entlastungsbetrag: '#10B981',
  pflegesachleistung: '#8B5CF6',
  verhinderungspflege: '#F59E0B',
  kurzzeitpflege: '#EC4899',
  zusatzbetreuung: '#06B6D4',
};

const PAYMENT_SOURCE_LABELS: Record<PaymentSource, string> = {
  selbstzahler: 'Selbstzahler',
  entlastungsbetrag: 'Entlastungsbetrag',
  pflegesachleistung: 'Pflegesachleistung',
  verhinderungspflege: 'Verhinderungspflege',
  kurzzeitpflege: 'Kurzzeitpflege',
  zusatzbetreuung: 'Zusatzbetreuung',
};

export function EarningsStatistics({ earnings, helperId }: EarningsStatisticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const now = new Date();
  
  // Calculate current month
  const currentMonth = now.toISOString().slice(0, 7);
  
  // Filter earnings by time range
  const filteredEarnings = useMemo(() => {
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'day':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
    }
    
    return earnings.filter(e => new Date(e.date) >= cutoffDate);
  }, [earnings, timeRange]);
  
  // Calculate total earnings
  const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
  const totalHours = filteredEarnings.reduce((sum, e) => sum + e.hours, 0);
  const avgHourlyRate = totalHours > 0 ? totalEarnings / totalHours : 0;
  
  // Calculate monthly income (for traffic light system)
  const monthlyEarnings = earnings.filter(e => e.date.startsWith(currentMonth));
  const monthlyIncome = monthlyEarnings.reduce((sum, e) => sum + e.amount, 0);
  
  // Traffic Light System
  const getTrafficLightStatus = (monthlyIncome: number) => {
    if (monthlyIncome >= 1500) {
      return {
        color: 'error',
        icon: AlertCircle,
        title: 'Rot: Selbstständigkeit empfohlen',
        message: 'Ihr monatliches Einkommen beträgt ≥ 1.500 €. Wir empfehlen, dass Sie sich selbstständig melden.',
        bgColor: 'bg-error/10',
        borderColor: 'border-error',
        textColor: 'text-error',
      };
    } else if (monthlyIncome >= 1000) {
      return {
        color: 'warning',
        icon: AlertTriangle,
        title: 'Gelb: Einkommen steigt',
        message: 'Ihr monatliches Einkommen beträgt über 1.000 €. Die Summe steigt langsam.',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning',
        textColor: 'text-warning',
      };
    } else {
      return {
        color: 'success',
        icon: CheckCircle,
        title: 'Grün: Alles im Rahmen',
        message: 'Ihr Einkommen liegt im normalen Bereich für kleine/unregelmäßige Beträge.',
        bgColor: 'bg-success/10',
        borderColor: 'border-success',
        textColor: 'text-success',
      };
    }
  };
  
  const trafficLight = getTrafficLightStatus(monthlyIncome);
  const TrafficIcon = trafficLight.icon;
  
  // Group by payment source
  const earningsBySource = useMemo(() => {
    const grouped: Record<PaymentSource, number> = {
      selbstzahler: 0,
      entlastungsbetrag: 0,
      pflegesachleistung: 0,
      verhinderungspflege: 0,
      kurzzeitpflege: 0,
      zusatzbetreuung: 0,
    };
    
    filteredEarnings.forEach(e => {
      grouped[e.paymentSource] += e.amount;
    });
    
    return Object.entries(grouped)
      .filter(([_, amount]) => amount > 0)
      .map(([source, amount]) => ({
        name: PAYMENT_SOURCE_LABELS[source as PaymentSource],
        value: amount,
        color: PAYMENT_SOURCE_COLORS[source as PaymentSource],
      }));
  }, [filteredEarnings]);
  
  // Calculate comparison with previous period
  const previousPeriodEarnings = useMemo(() => {
    const cutoffDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        startDate.setDate(startDate.getDate() - 2);
        break;
      case 'week':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        startDate.setDate(startDate.getDate() - 14);
        break;
      case 'month':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        startDate.setMonth(startDate.getMonth() - 2);
        break;
      case 'year':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;
    }
    
    return earnings
      .filter(e => {
        const date = new Date(e.date);
        return date >= startDate && date < cutoffDate;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [earnings, timeRange]);
  
  const earningsChange = previousPeriodEarnings > 0 
    ? ((totalEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Einnahmen-Statistik</h2>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {range === 'day' && 'Tag'}
              {range === 'week' && 'Woche'}
              {range === 'month' && 'Monat'}
              {range === 'year' && 'Jahr'}
            </button>
          ))}
        </div>
      </div>

      {/* Current Month Highlight */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-bold text-primary-900">Aktueller Monat</h3>
        </div>
        <p className="text-3xl font-bold text-primary-700">{monthlyIncome.toFixed(2)} €</p>
        <p className="text-sm text-primary-600 mt-1">
          {monthlyEarnings.length} {monthlyEarnings.length === 1 ? 'Auftrag' : 'Aufträge'} im {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Traffic Light System */}
      <div className={`${trafficLight.bgColor} rounded-xl p-6 border-2 ${trafficLight.borderColor}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${trafficLight.bgColor}`}>
            <TrafficIcon className={`w-8 h-8 ${trafficLight.textColor}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${trafficLight.textColor} mb-2`}>
              {trafficLight.title}
            </h3>
            <p className="text-neutral-700">{trafficLight.message}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Gesamteinnahmen</h3>
            <DollarSign className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{totalEarnings.toFixed(2)} €</p>
          <div className="flex items-center gap-2">
            {earningsChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error" />
            )}
            <span className={`text-sm font-medium ${earningsChange >= 0 ? 'text-success' : 'text-error'}`}>
              {earningsChange >= 0 ? '+' : ''}{earningsChange.toFixed(1)}%
            </span>
            <span className="text-sm text-neutral-500">vs. vorherige Periode</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Gesamtstunden</h3>
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{totalHours.toFixed(1)} h</p>
          <p className="text-sm text-neutral-500">in {filteredEarnings.length} Aufträgen</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Durchschn. Stundensatz</h3>
            <DollarSign className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{avgHourlyRate.toFixed(2)} €</p>
          <p className="text-sm text-neutral-500">pro Stunde</p>
        </div>
      </div>

      {/* Breakdown by Payment Source */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-6">Aufschlüsselung nach Geldquelle</h3>
        
        {earningsBySource.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={earningsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {earningsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* List */}
            <div className="space-y-3">
              {earningsBySource.map(source => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium text-neutral-700">{source.name}</span>
                  </div>
                  <span className="font-bold text-neutral-900">{source.value.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p>Keine Einnahmen im gewählten Zeitraum</p>
          </div>
        )}
      </div>
    </div>
  );
}
