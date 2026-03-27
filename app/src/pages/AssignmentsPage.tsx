import React, { useState } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { CreateAssignmentForm } from '../components/CreateAssignmentForm';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { HelperRecommendations } from '../components/HelperRecommendations';
import { ClipboardList, CheckCircle, Calendar } from 'lucide-react';

interface AssignmentsPageProps {
  user: User;
  assignments: Assignment[];
  users: User[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  onCreateAssignment: (assignment: Assignment) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onAssignHelper: (assignmentId: string, helperId: string) => void;
}

export function AssignmentsPage({
  user,
  assignments,
  users,
  availabilitySlots,
  chatMessages,
  todos,
  onCreateAssignment,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAssignHelper,
}: AssignmentsPageProps) {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<string | null>(null);

  const helpers = users.filter(u => u.role === 'helper');
  const isCoordinator = user.role === 'coordinator';

  const openAssignments = assignments.filter(a => a.status === 'OPEN' && a.coordinatorId === user.id);
  const myAssignments = isCoordinator
    ? assignments.filter(a => a.coordinatorId === user.id && ['ASSIGNED', 'IN_PROGRESS'].includes(a.status))
    : assignments.filter(a => a.helperId === user.id && ['ASSIGNED', 'IN_PROGRESS'].includes(a.status));
  const completedAssignments = assignments.filter(a => a.status === 'DONE');

  const selectedAssignment = selectedAssignmentId ? assignments.find(a => a.id === selectedAssignmentId) : null;

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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Aufträge</h1>
          <p className="text-neutral-600">
            {isCoordinator ? 'Verwalten Sie Ihre Pflegeaufträge' : 'Ihre verfügbaren Aufträge'}
          </p>
        </div>

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
                <div className="text-2xl font-bold">{myAssignments.length}</div>
                <div className="text-sm text-neutral-600">
                  {isCoordinator ? 'Laufende' : 'Meine Aufträge'}
                </div>
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

        {/* Create Assignment (Coordinator only) */}
        {isCoordinator && (
          <CreateAssignmentForm
            coordinatorId={user.id}
            coordinatorName={user.firstname}
            helpers={helpers}
            availabilitySlots={availabilitySlots}
            onCreate={onCreateAssignment}
          />
        )}

        {/* Open Assignments */}
        {isCoordinator && openAssignments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Offene Aufträge</h2>
            <div className="space-y-6">
              {openAssignments.map(assignment => (
                <div key={assignment.id}>
                  <button
                    onClick={() =>
                      setShowRecommendations(
                        showRecommendations === assignment.id ? null : assignment.id
                      )
                    }
                    className="w-full text-left"
                  >
                    <AssignmentCard assignment={assignment} currentUser={user} />
                  </button>
                  {showRecommendations === assignment.id && (
                    <div className="ml-0 sm:ml-4 mt-4">
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
          </div>
        )}

        {/* My Assignments */}
        {myAssignments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isCoordinator ? 'Laufende Aufträge' : 'Meine Aufträge'}
            </h2>
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
          </div>
        )}
      </div>

      {/* Modals */}
      {chatModalOpen && selectedAssignment && (
        <ChatModal
          assignment={selectedAssignment}
          messages={chatMessages}
          currentUserId={user.id}
          currentUserName={user.firstname}
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
