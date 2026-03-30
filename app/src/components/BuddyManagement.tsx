import React, { useMemo } from 'react';
import { BuddyRelationship, User } from '../types';
import { UserCheck, Calendar, DollarSign, CheckCircle, Clock, XCircle, Play, Pause, Settings } from 'lucide-react';

interface BuddyManagementProps {
  currentUser: User;
  buddyRelationships: BuddyRelationship[];
  users: User[];
  onAcceptBuddy?: (buddyId: string) => void;
  onPauseBuddy?: (buddyId: string) => void;
  onResumeBuddy?: (buddyId: string) => void;
  onEndBuddy?: (buddyId: string) => void;
  onToggleAutoAssign?: (buddyId: string, enabled: boolean) => void;
}

export function BuddyManagement({
  currentUser,
  buddyRelationships,
  users,
  onAcceptBuddy,
  onPauseBuddy,
  onResumeBuddy,
  onEndBuddy,
  onToggleAutoAssign,
}: BuddyManagementProps) {
  const myBuddies = useMemo(() => {
    return buddyRelationships.filter(b => 
      b.coordinatorId === currentUser.id || b.helperId === currentUser.id
    );
  }, [buddyRelationships, currentUser.id]);

  const activeBuddies = myBuddies.filter(b => b.status === 'active');
  const pendingBuddies = myBuddies.filter(b => b.status === 'pending');

  const getBuddyUser = (buddy: BuddyRelationship): User | undefined => {
    if (currentUser.role === 'coordinator') {
      return users.find(u => u.id === buddy.helperId);
    } else {
      return users.find(u => u.id === buddy.coordinatorId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderBuddyCard = (buddy: BuddyRelationship) => {
    const buddyUser = getBuddyUser(buddy);
    if (!buddyUser) return null;

    const isCoordinator = currentUser.role === 'coordinator';
    const isPending = buddy.status === 'pending';
    const isActive = buddy.status === 'active';
    const isPaused = buddy.status === 'paused';

    return (
      <div
        key={buddy.id}
        className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-all duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shrink-0 shadow-lg">
              {buddyUser.avatarUrl ? (
                <img 
                  src={buddyUser.avatarUrl} 
                  alt={`${buddyUser.firstname} ${buddyUser.surname}`}
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {buddyUser.firstname?.charAt(0)}{buddyUser.surname?.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-neutral-900">{buddyUser.firstname} {buddyUser.surname}</h3>
                {isActive && (
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Aktiv
                  </span>
                )}
                {isPending && (
                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ausstehend
                  </span>
                )}
                {isPaused && (
                  <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Pause className="w-3 h-3" />
                    Pausiert
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600">{buddyUser.zipCode}</p>
              {buddy.notes && (
                <p className="text-sm text-neutral-500 mt-1 italic">{buddy.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {isActive && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-neutral-600 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Seit</span>
              </div>
              <p className="font-bold text-sm text-neutral-900">
                {formatDate(buddy.acceptedAt || buddy.createdAt)}
              </p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-neutral-600 text-xs mb-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Aufträge</span>
              </div>
              <p className="font-bold text-sm text-neutral-900">{buddy.totalAssignments}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-neutral-600 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Stundensatz</span>
              </div>
              <p className="font-bold text-sm text-neutral-900">{buddy.preferredRate}€</p>
            </div>
          </div>
        )}

        {/* Auto-Assign Toggle */}
        {isActive && isCoordinator && (
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-neutral-900">Automatische Zuweisung</p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Neue Aufträge werden automatisch diesem Buddy zugewiesen
                  </p>
                </div>
              </div>
              <button
                onClick={() => onToggleAutoAssign?.(buddy.id, !buddy.autoAssign)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  buddy.autoAssign ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    buddy.autoAssign ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isPending && !isCoordinator && (
            <>
              <button
                onClick={() => onAcceptBuddy?.(buddy.id)}
                className="flex-1 px-4 py-2 bg-linear-to-r from-success/90 to-success text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Akzeptieren
              </button>
              <button
                onClick={() => onEndBuddy?.(buddy.id)}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors"
              >
                Ablehnen
              </button>
            </>
          )}

          {isActive && (
            <>
              <button
                onClick={() => onPauseBuddy?.(buddy.id)}
                className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pausieren
              </button>
              <button
                onClick={() => onEndBuddy?.(buddy.id)}
                className="px-4 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Beenden
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button
                onClick={() => onResumeBuddy?.(buddy.id)}
                className="flex-1 px-4 py-2 bg-linear-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Fortsetzen
              </button>
              <button
                onClick={() => onEndBuddy?.(buddy.id)}
                className="px-4 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20 transition-colors"
              >
                Beenden
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-br from-primary-700 via-primary-800 to-primary-900 text-white rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Buddy-System</h2>
            <p className="text-primary-100 text-sm mt-1">
              {currentUser.role === 'coordinator' 
                ? 'Ihre vertrauten Helper für regelmäßige Aufträge'
                : 'Ihre festen Coordinator-Partnerschaften'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-100 text-sm mb-2">Aktive Buddies</p>
            <p className="text-3xl font-bold">{activeBuddies.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-100 text-sm mb-2">Ausstehende Anfragen</p>
            <p className="text-3xl font-bold">{pendingBuddies.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-100 text-sm mb-2">Gesamt Aufträge</p>
            <p className="text-3xl font-bold">
              {activeBuddies.reduce((sum, b) => sum + b.totalAssignments, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Buddies */}
      {pendingBuddies.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Ausstehende Anfragen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBuddies.map(renderBuddyCard)}
          </div>
        </div>
      )}

      {/* Active Buddies */}
      {activeBuddies.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Aktive Buddies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBuddies.map(renderBuddyCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {myBuddies.length === 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Noch keine Buddies
          </h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            {currentUser.role === 'coordinator' 
              ? 'Bauen Sie langfristige Partnerschaften mit Ihren vertrauten Helpern auf. Regelmäßige Aufträge werden dann automatisch zugewiesen.'
              : 'Werden Sie Buddy eines Coordinators für regelmäßige, planbare Aufträge mit automatischer Zuweisung.'}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-linear-to-br from-accent-50 to-accent-100 rounded-xl p-6 border border-accent-200">
        <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent-600" />
          Wie funktioniert das Buddy-System?
        </h4>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span><strong>Automatische Zuweisung:</strong> Neue Aufträge gehen direkt an Ihren Buddy</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span><strong>Fester Stundensatz:</strong> Vereinbaren Sie einen bevorzugten Stundensatz</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span><strong>Direkte Abrechnung:</strong> Schnelle, unkomplizierte Zahlungsabwicklung</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span><strong>Flexibel:</strong> Pausieren oder beenden Sie die Partnerschaft jederzeit</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

