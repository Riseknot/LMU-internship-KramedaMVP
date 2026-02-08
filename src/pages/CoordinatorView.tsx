import React, { useState } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, CareFinance, CostEntry } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { CreateAssignmentForm } from '../components/CreateAssignmentForm';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { CareFinanceOverview } from '../components/CareFinanceOverview';
import { MapView } from '../components/MapView';
import { HelperRecommendations } from '../components/HelperRecommendations';
import { MobileSidebar } from '../components/MobileSidebar';
import { ClipboardList, Plus, Menu, Euro, Map, Calendar, User as UserIcon, CheckCircle } from 'lucide-react';

interface CoordinatorViewProps {
  user: User;
  assignments: Assignment[];
  users: User[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  finances: CareFinance[];
  costEntries: CostEntry[];
  onCreateAssignment: (assignment: Assignment) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateFinance: (finance: CareFinance) => void;
  onAddCostEntry: (entry: CostEntry) => void;
  onAssignHelper: (assignmentId: string, helperId: string) => void;
  onLogout: () => void;
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
  onCreateAssignment,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateFinance,
  onAddCostEntry,
  onAssignHelper,
  onLogout,
}: CoordinatorViewProps) {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('assignments');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<string | null>(null);

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
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{user.name}</h2>
                <p className="text-neutral-600">Koordinator</p>
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
            </div>
          </div>
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden z-30 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={user}
        onNavigate={setActivePage}
        onLogout={onLogout}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 pb-24 lg:pb-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {activePage === 'finance' && 'Kostenübersicht'}
            {activePage === 'map' && 'GPS Karte'}
            {activePage === 'profile' && 'Mein Profil'}
            {activePage === 'assignments' && `Willkommen, ${user.name}`}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            {activePage === 'finance' && 'Verwalten Sie Ihr Pflegebudget'}
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
