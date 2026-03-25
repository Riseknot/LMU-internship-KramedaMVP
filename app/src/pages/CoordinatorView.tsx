import React, { useState, useEffect } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, CareFinance, CostEntry, CareGrade, SocialFundContribution, BuddyRelationship } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { CreateAssignmentForm } from '../components/CreateAssignmentForm';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { CareFinanceOverview } from '../components/CareFinanceOverview';
import { MapView } from '../components/MapView';
import { HelperRecommendations } from '../components/HelperRecommendations';
import { HelperListView } from '../components/HelperListView';
import { GamificationPanel } from '../components/GamificationPanel';
import { CareGradeProfile } from '../components/CareGradeProfile';
import { NeedsCalculator } from '../components/NeedsCalculator';
import { SocialFundOverview } from '../components/SocialFundOverview';
import { BuddyManagement } from '../components/BuddyManagement';
import { MobileSidebar } from '../components/MobileSidebar';
import { ClipboardList, Plus, Menu, Euro, Map, Calendar, User as UserIcon, CheckCircle, Users, List, Calculator, Shield, Heart, UserCheck } from 'lucide-react';
import MyProfile from './myprofile/MyProfile';

interface CoordinatorViewProps {
  user: User;
  assignments: Assignment[];
  users: User[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  finances: CareFinance[];
  costEntries: CostEntry[];
  socialFundContributions: SocialFundContribution[];
  buddyRelationships: BuddyRelationship[];
  onCreateAssignment: (assignment: Assignment) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateFinance: (finance: CareFinance) => void;
  onAddCostEntry: (entry: CostEntry) => void;
  onAssignHelper: (assignmentId: string, helperId: string) => void;
  onLogout: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function CoordinatorView({
  user,
  assignments,
  users,
  availabilitySlots,
  chatMessages,
  todos,
  finances,
  costEntries,
  socialFundContributions,
  buddyRelationships,
  onCreateAssignment,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateFinance,
  onAddCostEntry,
  onAssignHelper,
  onLogout,
  onUserUpdate,
  activePage,
  onNavigate,
}: CoordinatorViewProps) {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<string | null>(null);
  const [helperViewMode, setHelperViewMode] = useState<'map' | 'list'>('list');

  // Sync with activePage prop
  useEffect(() => {
    // activePage is already controlled from parent
  }, [activePage]);

  const helpers = users.filter(u => u.role === 'helper');

  const openAssignments = assignments.filter(a => a.status === 'OPEN' && a.coordinatorId === user.id);
  const assignedAssignments = assignments.filter(
    a => (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS') && a.coordinatorId === user.id
  );
  const completedAssignments = assignments.filter(a => a.status === 'DONE' && a.coordinatorId === user.id);

  const selectedAssignment = selectedAssignmentId 
    ? assignments.find(a => a.id === selectedAssignmentId)
    : null;

  const handleOpenChat = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setChatModalOpen(true);
  };

  const handleOpenTodo = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setTodoModalOpen(true);
  };

  const handleShowRecommendations = (assignmentId: string) => {
    setShowRecommendations(assignmentId);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'buddies':
        return (
          <BuddyManagement
            currentUser={user}
            buddyRelationships={buddyRelationships}
            users={users}
            onAcceptBuddy={(buddyId) => {
              console.log('Accept buddy:', buddyId);
              alert('Buddy-Anfrage wurde akzeptiert!');
            }}
            onPauseBuddy={(buddyId) => {
              console.log('Pause buddy:', buddyId);
              alert('Buddy-Beziehung wurde pausiert.');
            }}
            onResumeBuddy={(buddyId) => {
              console.log('Resume buddy:', buddyId);
              alert('Buddy-Beziehung wurde fortgesetzt.');
            }}
            onEndBuddy={(buddyId) => {
              console.log('End buddy:', buddyId);
              if (confirm('Möchten Sie diese Buddy-Beziehung wirklich beenden?')) {
                alert('Buddy-Beziehung wurde beendet.');
              }
            }}
            onToggleAutoAssign={(buddyId, enabled) => {
              console.log('Toggle auto-assign:', buddyId, enabled);
              alert(`Automatische Zuweisung wurde ${enabled ? 'aktiviert' : 'deaktiviert'}.`);
            }}
          />
        );

      case 'sozialfond':
        return (
          <SocialFundOverview
            coordinatorId={user.id}
            contributions={socialFundContributions}
            users={users}
            onViewProfile={(userId) => {
              console.log('View profile:', userId);
              // In einer echten App würde hier das Profil geöffnet
              alert(`Profil-Ansicht für User ${userId} würde hier geöffnet werden`);
            }}
          />
        );

      case 'pflegegrad':
        return (
          <CareGradeProfile
            careGrade={user.careGrade}
            onUpdateCareGrade={(grade: CareGrade) => {
              // In a real app, this would update the user in the database
              console.log('Update care grade to:', grade);
              // For now, we'll just show it works
              alert(`Pflegegrad ${grade} wurde gespeichert`);
            }}
          />
        );

      case 'bedarfsermittlung':
        return (
          <NeedsCalculator
            careGrade={user.careGrade}
            onApplyAllocation={(allocation) => {
              console.log('Apply allocation:', allocation);
              alert('Zahlungsaufteilung wurde übernommen! Sie können diese nun bei der Auftragserstellung verwenden.');
            }}
          />
        );

      case 'finance':
        return (
          <CareFinanceOverview
            finances={finances}
            costEntries={costEntries}
            coordinatorId={user.id}
            onUpdateFinance={onUpdateFinance}
            onAddCostEntry={onAddCostEntry}
          />
        );

      case 'gamification':
        return user.gamification ? (
          <GamificationPanel 
            gamification={user.gamification}
            userName={user.name}
          />
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <p className="text-neutral-500">Gamification-Daten nicht verfügbar</p>
          </div>
        );

      case 'helpers':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Helper Übersicht</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setHelperViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    helperViewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Liste
                </button>
                <button
                  onClick={() => setHelperViewMode('map')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    helperViewMode === 'map'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Karte
                </button>
              </div>
            </div>

            {helperViewMode === 'list' ? (
              <HelperListView
                helpers={helpers}
                currentUser={user}
                onSendMessage={(helperId) => console.log('Send message to:', helperId)}
                onProposeAssignment={(helperId) => console.log('Propose assignment to:', helperId)}
              />
            ) : (
              <MapView
                currentUser={user}
                helpers={helpers}
                assignments={assignments}
              />
            )}
          </div>
        );

      case 'map':
        return (
          <MapView
            currentUser={user}
            helpers={helpers}
            assignments={assignments}
          />
        );

      case 'profile':
        return (
          <MyProfile user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />
        );

      case 'assignments':
      default:
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{openAssignments.length}</div>
                    <div className="text-sm text-neutral-600">Offene Aufträge</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{assignedAssignments.length}</div>
                    <div className="text-sm text-neutral-600">Laufende</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedAssignments.length}</div>
                    <div className="text-sm text-neutral-600">Abgeschlossen</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Assignment */}
            <div>
              <CreateAssignmentForm
                coordinatorId={user.id}
                coordinatorName={user.name}
                helpers={helpers}
                availabilitySlots={availabilitySlots}
                onCreate={onCreateAssignment}
              />
            </div>

            {/* Open Assignments with Recommendations */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Offene Aufträge</h2>
              {openAssignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                  <p className="text-neutral-500">Keine offenen Aufträge</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {openAssignments.map(assignment => (
                    <div key={assignment.id}>
                      <div className="mb-4">
                        <button
                          onClick={() => setShowRecommendations(
                            showRecommendations === assignment.id ? null : assignment.id
                          )}
                          className="w-full text-left"
                        >
                          <AssignmentCard
                            assignment={assignment}
                            currentUser={user}
                          />
                        </button>
                      </div>

                      {showRecommendations === assignment.id && (
                        <div className="ml-0 sm:ml-4 mb-6">
                          <HelperRecommendations
                            assignment={assignment}
                            helpers={helpers}
                            availabilitySlots={availabilitySlots}
                            onAssignHelper={onAssignHelper}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Assignments */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Laufende Aufträge</h2>
              {assignedAssignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                  <p className="text-neutral-500">Keine laufenden Aufträge</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {assignedAssignments.map(assignment => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      currentUser={user}
                      onOpenChat={handleOpenChat}
                      onOpenTodo={handleOpenTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {activePage === 'buddies' && 'Buddy-Management'}
            {activePage === 'sozialfond' && 'Sozialfond'}
            {activePage === 'pflegegrad' && 'Pflegegrad'}
            {activePage === 'bedarfsermittlung' && 'Bedarfsermittlung'}
            {activePage === 'finance' && 'Kostenübersicht'}
            {activePage === 'gamification' && 'Gamification'}
            {activePage === 'helpers' && 'Helper Übersicht'}
            {activePage === 'map' && 'GPS Karte'}
            {activePage === 'profile' && 'Mein Profil'}
            {activePage === 'assignments' && `Willkommen, ${user.name}`}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            {activePage === 'buddies' && 'Verwalten Sie Ihre Buddy-Beziehungen'}
            {activePage === 'sozialfond' && 'Übersicht über Sozialfond-Beiträge'}
            {activePage === 'pflegegrad' && 'Pflegegrad festlegen'}
            {activePage === 'bedarfsermittlung' && 'Bedarfsanalyse durchführen'}
            {activePage === 'finance' && 'Verwalten Sie Ihr Pflegebudget'}
            {activePage === 'gamification' && 'Gamification-Daten'}
            {activePage === 'helpers' && 'Finden Sie die passenden Helper für Ihre Aufträge'}
            {activePage === 'map' && 'Übersicht über Helper in Ihrer Nähe'}
            {activePage === 'profile' && 'Ihre persönlichen Informationen'}
            {activePage === 'assignments' && 'Koordination und Verwaltung von Pflegeaufträgen'}
          </p>
        </div>

        {renderContent()}
      </div>

      {/* Modals */}
      {chatModalOpen && selectedAssignment && (
        <ChatModal
          assignment={selectedAssignment}
          messages={chatMessages}
          currentUserId={user.id}
          currentUserName={user.name}
          onSendMessage={(msg) => onSendMessage(selectedAssignmentId!, msg)}
          onClose={() => setChatModalOpen(false)}
        />
      )}

      {todoModalOpen && selectedAssignment && (
        <TodoModal
          assignment={selectedAssignment}
          todos={todos}
          currentUser={user}
          onAddTodo={onAddTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onClose={() => setTodoModalOpen(false)}
        />
      )}
    </>
  );
}