import React, { useMemo } from 'react';
import { SocialFundContribution, User } from '../types';
import { Heart, TrendingUp, Users, ExternalLink, Calendar, DollarSign } from 'lucide-react';

interface SocialFundOverviewProps {
  coordinatorId: string;
  contributions: SocialFundContribution[];
  users: User[];
  onViewProfile: (userId: string) => void;
}

export function SocialFundOverview({
  coordinatorId,
  contributions,
  users,
  onViewProfile,
}: SocialFundOverviewProps) {
  // Filter contributions by this coordinator
  const myContributions = contributions.filter(c => c.coordinatorId === coordinatorId);

  // Calculate totals
  const totalContributed = useMemo(() => {
    return myContributions.reduce((sum, c) => sum + c.amount, 0);
  }, [myContributions]);

  // Get unique beneficiaries
  const beneficiaries = useMemo(() => {
    const uniqueBeneficiaries = new Map<string, {
      user: User;
      totalReceived: number;
      assignmentsCount: number;
    }>();

    myContributions.forEach(contribution => {
      if (contribution.beneficiaryId) {
        const existing = uniqueBeneficiaries.get(contribution.beneficiaryId);
        const user = users.find(u => u.id === contribution.beneficiaryId);

        if (user) {
          if (existing) {
            existing.totalReceived += contribution.amount;
            existing.assignmentsCount += 1;
          } else {
            uniqueBeneficiaries.set(contribution.beneficiaryId, {
              user,
              totalReceived: contribution.amount,
              assignmentsCount: 1,
            });
          }
        }
      }
    });

    return Array.from(uniqueBeneficiaries.values());
  }, [myContributions, users]);

  // Group by month
  const contributionsByMonth = useMemo(() => {
    const grouped = new Map<string, number>();
    
    myContributions.forEach(contribution => {
      const month = contribution.date.substring(0, 7); // YYYY-MM
      const existing = grouped.get(month) || 0;
      grouped.set(month, existing + contribution.amount);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort by month descending
      .slice(0, 6); // Last 6 months
  }, [myContributions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-br from-accent-600 via-accent-700 to-accent-900 text-white rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Sozialfond-Übersicht</h2>
              <p className="text-accent-100 text-sm mt-1">Ihr Beitrag zur Gemeinschaft</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-accent-100 text-sm mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Ihr Gesamtbeitrag</span>
              </div>
              <p className="text-3xl font-bold">{totalContributed.toFixed(2)} €</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-accent-100 text-sm mb-2">
                <Users className="w-4 h-4" />
                <span>Menschen geholfen</span>
              </div>
              <p className="text-3xl font-bold">{beneficiaries.length}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-accent-100 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>Aufträge unterstützt</span>
              </div>
              <p className="text-3xl font-bold">{myContributions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiaries */}
      {beneficiaries.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-600" />
              Menschen, denen Sie geholfen haben
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Diese Personen haben durch Ihre Beiträge Unterstützung erhalten
            </p>
          </div>

          <div className="divide-y divide-neutral-200">
            {beneficiaries.map(({ user, totalReceived, assignmentsCount }) => (
              <div
                key={user.id}
                className="p-6 hover:bg-neutral-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-linear-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={`${user.firstname} ${user.surname}`} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {user.firstname?.charAt(0)}{user.surname?.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-neutral-900">{user.firstname} {user.surname}</h4>
                        {user.socialFundEligible && (
                          <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                            Sozialfond-berechtigt
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-3">
                        {user.role === 'helper' ? 'Helper' : 'Coordinator'} · {user.zipCode}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-accent-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">{totalReceived.toFixed(2)} € erhalten</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <Calendar className="w-4 h-4" />
                          <span>{assignmentsCount} Auftrag{assignmentsCount !== 1 ? 'e' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    onClick={() => onViewProfile(user.id)}
                    className="px-4 py-2 bg-linear-to-r from-accent-600 to-accent-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                  >
                    Profil anzeigen
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      {contributionsByMonth.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-600" />
              Monatliche Beiträge
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Übersicht der letzten 6 Monate
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {contributionsByMonth.map(([month, amount]) => {
                const percentage = (amount / totalContributed) * 100;
                
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-neutral-700">{formatMonth(month)}</span>
                      <span className="font-bold text-accent-600">{amount.toFixed(2)} €</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-linear-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Contributions */}
      {myContributions.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent-600" />
              Letzte Beiträge
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Ihre neuesten Sozialfond-Zahlungen
            </p>
          </div>

          <div className="divide-y divide-neutral-200">
            {myContributions
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((contribution) => (
                <div key={contribution.id} className="p-4 hover:bg-neutral-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-neutral-900">
                          {contribution.assignmentTitle || 'Allgemeiner Beitrag'}
                        </p>
                        {contribution.beneficiaryName && (
                          <span className="text-sm text-neutral-500">
                            → {contribution.beneficiaryName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        {formatDate(contribution.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-600">{contribution.amount.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {myContributions.length === 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Noch keine Beiträge
          </h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            Sie haben noch keine Beiträge zum Sozialfond geleistet. 
            Ein kleiner Prozentsatz Ihrer Zahlungen fließt automatisch in den Fonds 
            und hilft Menschen in finanziell schwierigen Situationen.
          </p>
        </div>
      )}
    </div>
  );
}


