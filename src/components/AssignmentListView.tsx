import React from 'react';
import { Assignment, User } from '../types';
import { Calendar, Clock, MapPin, Tag, User as UserIcon, CheckCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AssignmentListViewProps {
  assignments: Assignment[];
  currentUser: User;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function AssignmentListView({ 
  assignments, 
  currentUser,
  onAccept,
  onReject 
}: AssignmentListViewProps) {
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DONE':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusLabel = (status: Assignment['status']) => {
    switch (status) {
      case 'OPEN':
        return 'Offen';
      case 'ASSIGNED':
        return 'Zugewiesen';
      case 'IN_PROGRESS':
        return 'In Bearbeitung';
      case 'DONE':
        return 'Abgeschlossen';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getMatchScore = (assignment: Assignment) => {
    if (!currentUser.skills || !currentUser.zipCode) return 0;
    
    const skillMatch = assignment.requiredSkills.filter(skill => 
      currentUser.skills?.includes(skill)
    ).length / Math.max(assignment.requiredSkills.length, 1) * 100;
    
    const zipDiff = Math.abs(parseInt(assignment.zipCode) - parseInt(currentUser.zipCode));
    const distanceScore = Math.max(0, 100 - zipDiff);
    
    return Math.round((skillMatch + distanceScore) / 2);
  };

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500">Keine Aufträge verfügbar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const startDateTime = formatDateTime(assignment.startTime);
            const endDateTime = formatDateTime(assignment.endTime);
            const matchScore = getMatchScore(assignment);

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-neutral-200 hover:border-primary-300 transition-all overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {assignment.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(assignment.status)}`}>
                        {getStatusLabel(assignment.status)}
                      </span>
                    </div>
                  </div>

                  {/* Match Score (for open assignments) */}
                  {assignment.status === 'OPEN' && matchScore > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg border border-accent-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">
                          Match-Score
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${matchScore}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full ${
                                matchScore >= 80 ? 'bg-green-500' :
                                matchScore >= 60 ? 'bg-accent-500' :
                                'bg-yellow-500'
                              }`}
                            />
                          </div>
                          <span className="text-sm font-bold text-neutral-900">
                            {matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-700">{startDateTime.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-700">
                        {startDateTime.time} - {endDateTime.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-700">PLZ {assignment.zipCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-700">{assignment.coordinatorName}</span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  {assignment.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-700">Erforderliche Fähigkeiten:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {assignment.requiredSkills.map((skill, idx) => {
                          const hasSkill = currentUser.skills?.includes(skill);
                          return (
                            <span 
                              key={idx}
                              className={`px-2 py-1 text-xs rounded ${
                                hasSkill 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {hasSkill && '✓ '}
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions for open assignments */}
                  {assignment.status === 'OPEN' && onAccept && onReject && (
                    <div className="flex gap-2 pt-4 border-t border-neutral-200">
                      <button
                        onClick={() => onReject(assignment.id)}
                        className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Ablehnen
                      </button>
                      <button
                        onClick={() => onAccept(assignment.id)}
                        className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Annehmen
                      </button>
                    </div>
                  )}

                  {/* Helper name for assigned/in progress */}
                  {assignment.helperName && assignment.status !== 'OPEN' && (
                    <div className="pt-4 border-t border-neutral-200">
                      <p className="text-sm text-neutral-600">
                        Helper: <span className="font-medium text-neutral-900">{assignment.helperName}</span>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
