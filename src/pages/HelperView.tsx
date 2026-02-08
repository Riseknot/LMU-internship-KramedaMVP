import React, { useState } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { AvailabilityManager } from '../components/AvailabilityManager';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { Dashboard } from '../components/Dashboard';
import { MobileSidebar } from '../components/MobileSidebar';
import { Calendar, Clock, Settings, BarChart3, Menu, User as UserIcon } from 'lucide-react';

interface HelperViewProps {
  user: User;
  assignments: Assignment[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  onAcceptAssignment: (id: string) => void;
  onRejectAssignment: (id: string) => void;
  onUpdateAvailability: (slots: AvailabilitySlot[]) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onLogout: () => void;
}

type TabType = 'assignments' | 'calendar' | 'availability' | 'dashboard' | 'profile';

export function HelperView({
  user,
  assignments,
  availabilitySlots,
  chatMessages,
  todos,
  onAcceptAssignment,
  onRejectAssignment,
  onUpdateAvailability,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onLogout,
}: HelperViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('assignments');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const userSlots = availabilitySlots.filter(slot => slot.userId === user.id);
  const openAssignments = assignments.filter(a => a.status === 'OPEN');
  const myAssignments = assignments.filter(
    a => a.helperId === user.id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS')
  );

  const tabs = [
    { id: 'assignments', label: 'Aufträge', icon: Calendar, count: openAssignments.length },
    { id: 'calendar', label: 'Kalender', icon: Clock, count: myAssignments.length },
    { id: 'availability', label: 'Verfügbarkeit', icon: Settings },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: UserIcon },
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
            <h2 className="text-xl font-semibold mb-4">Offene Aufträge</h2>
            {openAssignments.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 sm:p-12 text-center">
                <p className="text-neutral-500">Keine offenen Aufträge verfügbar</p>
              </div>
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
          <Dashboard assignments={assignments} userId={user.id} />
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 sm:p-12">
            <h2 className="text-xl font-semibold mb-4">Profil</h2>
            <p className="text-sm text-neutral-600">Hier können Sie Ihre Profildaten verwalten</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onLogout}
              >
                Abmelden
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {chatModalOpen && selectedAssignment && (
        <ChatModal
          assignment={selectedAssignment}
          messages={chatMessages}
          currentUserId={user.id}
          currentUserName={user.name}
          onSendMessage={(msg) => onSendMessage(selectedAssignmentId, msg)}
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

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={user}
        onNavigate={setActiveTab}
        onLogout={onLogout}
        activePage={activeTab}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden z-30 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}