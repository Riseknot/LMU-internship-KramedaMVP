import React from 'react';
import { Assignment, User } from '../types';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, MessageSquare, ClipboardList, Star } from 'lucide-react';
import { motion } from 'motion/react';

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
  const startDate = new Date(assignment.start);
  const endDate = new Date(assignment.end);
  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const hourlyRate = assignment.hourlyRate || 25;
  const totalEarning = durationHours * hourlyRate;
  
  const statusPillStyles = {
    OPEN: 'bg-secondary-500/20 text-secondary-200 border-secondary-500/40',
    ASSIGNED: 'bg-primary-500/20 text-primary-200 border-primary-500/40',
    IN_PROGRESS: 'bg-success/20 text-success border-success/30',
    DONE: 'bg-accent-500/20 text-accent-200 border-accent-500/40',
  };

  const statusLabels = {
    OPEN: 'Verfügbar',
    ASSIGNED: 'Zugewiesen',
    IN_PROGRESS: 'Im Einsatz',
    DONE: 'Erledigt',
  };

  const isHelper = currentUser.role === 'helper';
  const isOwnAssignment = assignment.helperId === currentUser.id;
  const canAcceptReject = isHelper && assignment.status === 'OPEN' && !isOwnAssignment;
  const canInteract = (assignment.status === 'ASSIGNED' || assignment.status === 'IN_PROGRESS') && 
                      (isOwnAssignment || currentUser.role === 'coordinator');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -4 }}
      className="rounded-2xl border border-neutral-700 bg-neutral-900/85 p-5 sm:p-6 shadow-lg transition-all duration-300"
    >
      {/* Header with status badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {assignment.title}
          </h3>
          <p className="text-sm text-neutral-300 line-clamp-1">
            {assignment.description}
          </p>
          <p className="mt-2 text-xs font-medium text-neutral-400">
            {startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            {' - '}
            {endDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            {' · PLZ '}
            {assignment.address.zipCode}
          </p>
        </div>
        <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${statusPillStyles[assignment.status]}`}>
          {statusLabels[assignment.status]}
        </span>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-neutral-950 rounded-lg border border-neutral-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600 shrink-0" />
          <div>
            <p className="text-xs text-neutral-400 font-medium">DATUM</p>
            <p className="text-sm font-semibold text-neutral-100">
              {startDate.toLocaleDateString('de-DE', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-secondary-600 shrink-0" />
          <div>
            <p className="text-xs text-neutral-400 font-medium">DAUER</p>
            <p className="text-sm font-semibold text-neutral-100">
              {durationHours.toFixed(1)}h ({startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })})
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent-600 shrink-0" />
          <div>
            <p className="text-xs text-neutral-400 font-medium">PLZ</p>
            <p className="text-sm font-semibold text-neutral-100">
              {assignment.address.zipCode}
            </p>
          </div>
        </div>

        {isHelper && canAcceptReject && (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent-500 shrink-0 fill-accent-500" />
            <div>
              <p className="text-xs text-neutral-400 font-medium">VERDIENST</p>
              <p className="text-sm font-bold text-accent-700">
                €{totalEarning.toFixed(0)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {assignment.requiredSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-neutral-400 mb-2">ERFORDERLICHE FÄHIGKEITEN</p>
          <div className="flex flex-wrap gap-2">
            {assignment.requiredSkills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium border border-primary-200">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assistant info */}
      {assignment.helperName && (
        <div className="mb-4 p-3 bg-primary-950/50 rounded-lg border border-primary-800/50">
          <p className="text-sm text-primary-100">
            <strong>Zugeordneter Helper:</strong> {assignment.helperName}
          </p>
        </div>
      )}

      {/* Action Buttons – Uber-style: big, clear, minimal friction */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {canAcceptReject && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAccept?.(assignment.id)}
              className="col-span-1 sm:col-span-2 px-4 py-3.5 btn-base btn-primary rounded-lg font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Annehmen</span>
              <span className="sm:hidden">Ja</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject?.(assignment.id)}
              className="btn-base btn-dark-ghost col-span-1 px-4 py-3.5 font-bold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <XCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Pass</span>
            </motion.button>
          </>
        )}
        
        {canInteract && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenChat?.(assignment.id)}
              className="px-4 py-3 btn-base btn-secondary rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenTodo?.(assignment.id)}
              className="btn-base btn-primary px-4 py-3 font-bold transition-all flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Log</span>
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
