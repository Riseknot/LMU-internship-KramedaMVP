import React from 'react';
import { motion } from 'motion/react';
import { User, Assignment } from '../types';
import { Clock, MapPin } from 'lucide-react';

interface DashboardHomeProps {
  currentUser: User;
  assignments: Assignment[];
  helpers?: User[];
  onNavigate?: (page: string) => void;
}

export function DashboardHome({
  currentUser,
  assignments,
  helpers = [],
  onNavigate,
}: DashboardHomeProps) {
  const activeAssignments = assignments.filter(a => a.status === 'IN_PROGRESS').length;
  const completedAssignments = assignments.filter(a => a.status === 'DONE').length;
  const openAssignments = assignments.filter(a => a.status === 'OPEN').length;
  
  const isHelper = currentUser.role === 'helper';
  const firstName = currentUser.firstname || 'Willkommen';
  const suggestionAssignments = assignments.filter(a => a.status === 'OPEN').slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 rounded-3xl border border-neutral-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm md:p-7"
        >
          <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-neutral-900 sm:text-4xl font-serif">
                Willkommen zurück, {firstName}
              </h1>
              <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
                {isHelper
                  ? 'Passende Einsätze in Ihrer Nähe in wenigen Klicks.'
                  : 'Aufträge schnell priorisieren und sicher steuern.'}
              </p>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-primary-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Heute im Blick</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white p-2">
                  <p className="text-[11px] text-neutral-500">Offen</p>
                  <p className="text-sm font-bold text-neutral-900">{openAssignments}</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-[11px] text-neutral-500">Aktiv</p>
                  <p className="text-sm font-bold text-neutral-900">{activeAssignments}</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-[11px] text-neutral-500">Fertig</p>
                  <p className="text-sm font-bold text-neutral-900">{completedAssignments}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={() => onNavigate?.(isHelper ? 'helptasks' : 'assignments')}
                  className="btn-base btn-primary rounded-xl px-4 py-2.5 text-sm"
                >
                  {isHelper ? 'Jetzt buchen' : 'Aufträge öffnen'}
                </button>
                <button
                  onClick={() => onNavigate?.('helpers')}
                  className="btn-base btn-ghost rounded-xl px-4 py-2.5 text-sm"
                >
                  Profile ansehen
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Airbnb-style Visual Feed</h2>
            <span className="text-xs font-medium text-neutral-500">Auftragsvorschlaege</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(suggestionAssignments.length > 0 ? suggestionAssignments : assignments.slice(0, 3)).map((assignment, index) => (
              <motion.article
                key={assignment.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.24 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 shadow-sm"
              >
                <div className="h-28 bg-linear-to-br from-primary-200 via-primary-100 to-secondary-100">
                  <div className="flex h-full items-start justify-between p-4">
                    <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-primary-700 backdrop-blur-sm">
                      Vorschlag #{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-primary-700">0{index + 1}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                    {assignment.description || 'Direkt passend fuer Ihren aktuellen Tagesplan.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-700">
                      PLZ {assignment.address.zipCode}
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-700">
                      {new Date(assignment.start).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Offen</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{openAssignments}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Aktiv</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{activeAssignments}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Fertig</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{completedAssignments}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Helper</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{helpers.length}</p>
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="mb-10 space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Aktuelle Einsaetze</h2>
            {assignments.slice(0, 3).map((assignment, idx) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.28 + idx * 0.08 }}
                className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white/85 p-4"
              >
                <div
                  className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                    assignment.status === 'IN_PROGRESS'
                      ? 'bg-success'
                      : assignment.status === 'DONE'
                        ? 'bg-accent-500'
                        : 'bg-secondary-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-neutral-900">{assignment.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(assignment.start).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      PLZ {assignment.address.zipCode}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
