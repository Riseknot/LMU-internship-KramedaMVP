import React, { useState, useEffect } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, HelperEarning, BuddyRelationship } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { AssignmentListView } from '../components/AssignmentListView';
import { AvailabilityManager } from '../components/AvailabilityManager';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { Dashboard } from '../components/Dashboard';
import { GamificationPanel } from '../components/GamificationPanel';
import { CertificationManager } from '../components/CertificationManager';
import { EarningsStatistics } from '../components/EarningsStatistics';
import { BuddyManagement } from '../components/BuddyManagement';
import { Calendar, Clock, Settings, BarChart3, User as UserIcon, Trophy, List, UserCheck } from 'lucide-react';

interface HelperViewProps {
  user: User;
  assignments: Assignment[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  helperEarnings: HelperEarning[];
  buddyRelationships: BuddyRelationship[];
  users: User[];
  onAcceptAssignment: (id: string) => void;
  onRejectAssignment: (id: string) => void;
  onUpdateAvailability: (slots: AvailabilitySlot[]) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onLogout: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

type TabType = 'assignments' | 'calendar' | 'availability' | 'dashboard' | 'profile' | 'gamification' | 'buddies';

export function HelperView({
  user,
  assignments,
  availabilitySlots,
  chatMessages,
  todos,
  helperEarnings,
  buddyRelationships,
  users,
  onAcceptAssignment,
  onRejectAssignment,
  onUpdateAvailability,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onLogout,
  activePage,
  onNavigate,
}: HelperViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>(activePage as TabType);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Sync activeTab with activePage prop
  useEffect(() => {
    setActiveTab(activePage as TabType);
  }, [activePage]);

  const userSlots = availabilitySlots.filter(slot => slot.userId === user.id);
  const openAssignments = assignments.filter(a => a.status === 'OPEN');
  const myAssignments = assignments.filter(
    a => a.helperId === user.id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS')
  );

  const tabs = [
    { id: 'assignments', label: 'Aufträge', icon: List, count: openAssignments.length },
    { id: 'calendar', label: 'Kalender', icon: Clock, count: myAssignments.length },
    { id: 'availability', label: 'Verfügbarkeit', icon: Settings },
    { id: 'gamification', label: 'Erfolge', icon: Trophy },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'buddies', label: 'Buddies', icon: UserCheck },
  ];

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

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Willkommen, {user.name}</h1>
          <p className="text-sm sm:text-base text-neutral-600">Verwalten Sie Ihre Einsätze und Verfügbarkeit</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-200 -mx-4 px-4 overflow-x-auto">
          
        </div>

        {/* Content */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Offene Aufträge</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {openAssignments.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 sm:p-12 text-center">
                <p className="text-neutral-500">Keine offenen Aufträge verfügbar</p>
              </div>
            ) : viewMode === 'list' ? (
              <AssignmentListView
                assignments={openAssignments}
                currentUser={user}
                onAccept={onAcceptAssignment}
                onReject={onRejectAssignment}
              />
            ) : (
              <div className="grid gap-4">
                {openAssignments.map(assignment => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    currentUser={user}
                    onAccept={onAcceptAssignment}
                    onReject={onRejectAssignment}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Meine bestätigten Einsätze</h2>
            {myAssignments.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 sm:p-12 text-center">
                <p className="text-neutral-500">Keine bestätigten Einsätze</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myAssignments.map(assignment => (
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
        )}

        {activeTab === 'availability' && (
          <AvailabilityManager
            userId={user.id}
            slots={userSlots}
            onSave={onUpdateAvailability}
          />
        )}

        {activeTab === 'dashboard' && (
          <EarningsStatistics 
            earnings={helperEarnings.filter(e => e.helperId === user.id)} 
            helperId={user.id} 
          />
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{user.name}</h2>
                  <p className="text-neutral-600">Helper</p>
                  {user.gamification && (
                    <p className="text-sm text-primary-600 font-medium mt-1">
                      Level {user.gamification.level} · {user.gamification.points} XP
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">E-Mail</label>
                  <p className="text-neutral-900">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Telefon</label>
                    <p className="text-neutral-900">{user.phone}</p>
                  </div>
                )}
                {user.zipCode && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">PLZ</label>
                    <p className="text-neutral-900">{user.zipCode}</p>
                  </div>
                )}
                {user.bio && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Bio</label>
                    <p className="text-neutral-900">{user.bio}</p>
                  </div>
                )}
                {user.skills && user.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 mb-2 block">Fähigkeiten</label>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <CertificationManager
                certifications={user.certifications || []}
                isOwnProfile={true}
                onUpload={(cert) => console.log('Upload cert:', cert)}
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={onLogout}
              >
                Abmelden
              </button>
            </div>
          </div>
        )}

        {activeTab === 'gamification' && user.gamification && (
          <GamificationPanel 
            gamification={user.gamification}
            userName={user.name}
          />
        )}

        {activeTab === 'buddies' && (
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
        )}
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