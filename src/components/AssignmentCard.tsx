import React from 'react';
import { Assignment, User } from '../types';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, MessageSquare, ClipboardList } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  currentUser: User;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onOpenChat?: (id: string) => void;
  onOpenTodo?: (id: string) => void;
}

export function AssignmentCard({ 
  assignment, 
  currentUser, 
  onAccept, 
  onReject,
  onOpenChat,
  onOpenTodo,
}: AssignmentCardProps) {
  const startDate = new Date(assignment.startTime);
  const endDate = new Date(assignment.endTime);
  
  const statusColors = {
    OPEN: 'bg-blue-100 text-blue-800',
    ASSIGNED: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-green-100 text-green-800',
    DONE: 'bg-neutral-200 text-neutral-700',
  };

  const statusLabels = {
    OPEN: 'Offen',
    ASSIGNED: 'Zugewiesen',
    IN_PROGRESS: 'In Bearbeitung',
    DONE: 'Abgeschlossen',
  };

  const isHelper = currentUser.role === 'helper';
  const isOwnAssignment = assignment.helperId === currentUser.id;
  const canAcceptReject = isHelper && assignment.status === 'OPEN' && !isOwnAssignment;
  const canInteract = (assignment.status === 'ASSIGNED' || assignment.status === 'IN_PROGRESS') && 
                      (isOwnAssignment || currentUser.role === 'coordinator');

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1 truncate">{assignment.title}</h3>
          <p className="text-sm text-neutral-600 line-clamp-2">{assignment.description}</p>
        </div>
        <span className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[assignment.status]}`}>
          {statusLabels[assignment.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{startDate.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{assignment.coordinatorName} · PLZ {assignment.zipCode}</span>
        </div>
      </div>

      {assignment.requiredSkills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {assignment.requiredSkills.map(skill => (
              <span key={skill} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {assignment.helperName && (
        <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
          <span className="text-sm text-neutral-700">
            <strong>Helper:</strong> {assignment.helperName}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {canAcceptReject && (
          <>
            <button
              onClick={() => onAccept?.(assignment.id)}
              className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Annehmen
            </button>
            <button
              onClick={() => onReject?.(assignment.id)}
              className="flex-1 px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Ablehnen
            </button>
          </>
        )}
        
        {canInteract && (
          <>
            <button
              onClick={() => onOpenChat?.(assignment.id)}
              className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </button>
            <button
              onClick={() => onOpenTodo?.(assignment.id)}
              className="flex-1 px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Tagebuch</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}