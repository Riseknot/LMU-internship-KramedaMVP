import React, { useState } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem } from '../types';
import { AssignmentCard } from '../components/AssignmentCard';
import { CreateHelptaskForm } from '../../helptasks/components/CreateHelptaskForm';
import { ChatModal } from '../components/ChatModal';
import { TodoModal } from '../components/TodoModal';
import { HelperRecommendations } from '../components/HelperRecommendations';
import { CreateHelptaskFormData } from '../../helptasks/types';
import { PageShell, SectionCard } from '../components/PageShell';

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

  const handleCreateAssignment = (data: CreateHelptaskFormData) => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: data.title,
      description: data.description,
      coordinatorId: user.id,
      coordinatorName: user.firstname,
      status: 'OPEN',
      start: data.start,
      end: data.end,
      address: {
        zipCode: data.zipCode,
        city: data.city,
        street: data.street,
        streetNumber: data.streetNumber,
      },
      requiredSkills: data.requirements.skills,
      createdAt: new Date().toISOString(),
    };

    onCreateAssignment(newAssignment);
  };

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
      <PageShell
        eyebrow="Operations"
        title="Aufträge"
        description={isCoordinator ? 'Pflegeaufträge klarer erfassen und koordinieren.' : 'Ihre Einsätze ruhig und übersichtlich verwalten.'}
        metrics={[
          { label: 'Offen', value: openAssignments.length, hint: 'warten auf Match', tone: 'accent' },
          { label: isCoordinator ? 'Laufend' : 'Meine', value: myAssignments.length, hint: 'aktive Einsätze', tone: 'primary' },
          { label: 'Erledigt', value: completedAssignments.length, hint: 'abgeschlossen', tone: 'success' },
        ]}
      >
        <SectionCard title="Ablauf" description="Drei einfache Schritte vom Auftrag bis zum laufenden Einsatz.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="surface-card-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">01</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">Anfrage erfassen</p>
            </div>
            <div className="surface-card-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">02</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">Helper matchen</p>
            </div>
            <div className="surface-card-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">03</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">Einsatz starten</p>
            </div>
          </div>
        </SectionCard>

        {isCoordinator && (
          <CreateHelptaskForm
            coordinatorId={user.id}
            coordinatorName={user.firstname}
            helpers={helpers}
            availabilitySlots={availabilitySlots}
            onCreate={handleCreateAssignment}
          />
        )}

        {isCoordinator && openAssignments.length > 0 && (
          <SectionCard title="Offene Aufträge" description="Neue Anfragen mit passenden Helfer:innen abgleichen." bodyClassName="space-y-6">
            {openAssignments.map(assignment => (
              <div key={assignment.id}>
                <button
                  onClick={() =>
                    setShowRecommendations(
                      showRecommendations === assignment.id ? null : assignment.id
                    )
                  }
                  className="btn-reset w-full text-left"
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
          </SectionCard>
        )}

        <SectionCard
          title={isCoordinator ? 'Laufende Aufträge' : 'Meine Aufträge'}
          description={myAssignments.length > 0 ? 'Alle aktiven Einsätze an einem Ort.' : 'Sobald neue Einsätze aktiv sind, erscheinen sie hier.'}
          bodyClassName="grid gap-4"
        >
          {myAssignments.length > 0 ? (
            myAssignments.map(assignment => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                currentUser={user}
                onOpenChat={handleOpenChat}
                onOpenTodo={handleOpenTodo}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-8 text-center text-sm text-neutral-500">
              Aktuell gibt es keine laufenden Aufträge.
            </div>
          )}
        </SectionCard>
      </PageShell>

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
