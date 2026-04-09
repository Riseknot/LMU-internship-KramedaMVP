import React from 'react';
import { motion } from 'motion/react';
import { User, Assignment } from '../types';
import { ArrowRight, CheckCircle2, Clock, MapPin, Sparkles, TrendingUp, Users } from 'lucide-react';

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
  const barWidth = (value: number) => `${(value / Math.max(assignments.length, 1)) * 100}%`;
  const completionRate = Math.round((completedAssignments / Math.max(assignments.length, 1)) * 100);
  const weekPulse = [
    { day: 'Mo', value: openAssignments + 2 },
    { day: 'Di', value: activeAssignments + 3 },
    { day: 'Mi', value: Math.max(openAssignments, 1) + 4 },
    { day: 'Do', value: activeAssignments + 2 },
    { day: 'Fr', value: completedAssignments + 3 },
    { day: 'Sa', value: Math.max(helpers.length, 1) + 1 },
    { day: 'So', value: Math.max(suggestionAssignments.length, 1) + 2 },
  ];
  const maxPulse = Math.max(...weekPulse.map((item) => item.value), 1);

  return (
    <div className="bg-transparent">
      <div className="page-shell max-w-6xl pb-5 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="page-header-card mb-5 md:p-7"
        >
          <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <div>
              <p className="page-eyebrow">{isHelper ? 'Heute in Ihrer Nähe' : 'Heute priorisieren'}</p>
              <h1 className="text-[clamp(2.7rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.06em] text-neutral-950">
                Willkommen zurück, {firstName}
              </h1>
              <p className="mt-3 max-w-xl text-base text-neutral-600">
                {isHelper
                  ? 'Passende Einsätze finden, schnell entscheiden und direkt loslegen.'
                  : 'Aufträge steuern, Prioritäten setzen und Ihr Netzwerk im Blick behalten.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 sm:max-w-md">
                <button
                  onClick={() => onNavigate?.(isHelper ? 'helptasks' : 'assignments')}
                  className="btn-base btn-primary rounded-xl px-4 py-3 text-sm"
                >
                  {isHelper ? 'Jetzt Einsätze finden' : 'Aufträge öffnen'}
                </button>
                <button
                  onClick={() => onNavigate?.('helpers')}
                  className="btn-base btn-ghost rounded-xl px-4 py-3 text-sm"
                >
                  Profile ansehen
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.4rem] bg-neutral-950 p-4 text-white shadow-[0_18px_40px_rgba(12,13,12,0.18)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Live Snapshot</p>
                    <p className="mt-2 text-3xl font-black">{completionRate}% erledigt</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-secondary-300" />
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Offen', value: openAssignments },
                    { label: 'Aktiv', value: activeAssignments },
                    { label: 'Fertig', value: completedAssignments },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-white/70">{item.label}</span>
                        <span className="font-semibold text-white">{item.value}</span>
                      </div>
                      <div className="mini-bar-track bg-white/10">
                        <div className="mini-bar-fill" style={{ width: barWidth(item.value) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-neutral-200 bg-white/92 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Helper</p>
                  <p className="mt-1 text-xl font-black text-neutral-950">{helpers.length}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white/92 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Matches</p>
                  <p className="mt-1 text-xl font-black text-neutral-950">{suggestionAssignments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-5 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="surface-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-neutral-950">Empfohlene Einsätze</h2>
              <span className="text-xs font-medium text-neutral-500">für heute</span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {(suggestionAssignments.length > 0 ? suggestionAssignments : assignments.slice(0, 3)).map((assignment, index) => (
                <motion.article
                  key={assignment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.24 + index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white/96 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-24 bg-[linear-gradient(135deg,rgba(34,160,107,0.14),rgba(255,255,255,0.95),rgba(224,138,18,0.12))]">
                    <div className="flex h-full items-start justify-between p-4">
                      <span className="rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-800">
                        Vorschlag #{index + 1}
                      </span>
                      <ArrowRight className="h-4 w-4 text-neutral-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-neutral-900 line-clamp-1">{assignment.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                      {assignment.description || 'Direkt passend für den heutigen Ablauf.'}
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

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="surface-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-neutral-950">Rhythmus & Netzwerk</h2>
              <span className="inline-flex items-center gap-1 text-xs text-neutral-500"><TrendingUp className="h-3.5 w-3.5" /> live</span>
            </div>

            <div className="grid h-32 grid-cols-7 items-end gap-2">
              {weekPulse.map((item) => (
                <div key={item.day} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="w-full rounded-t-xl bg-[linear-gradient(180deg,rgba(34,160,107,0.22),rgba(22,24,22,0.92))]" style={{ height: `${(item.value / maxPulse) * 100}%` }} />
                  <span className="text-[11px] font-semibold text-neutral-500">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="surface-card-muted px-3 py-3">
                <div className="flex items-center gap-2 text-neutral-500"><Users className="h-4 w-4" /> Reichweite</div>
                <p className="mt-1 text-2xl font-black text-neutral-950">{helpers.length + suggestionAssignments.length}</p>
              </div>
              <div className="surface-card-muted px-3 py-3">
                <div className="flex items-center gap-2 text-neutral-500"><CheckCircle2 className="h-4 w-4" /> Abschlussquote</div>
                <p className="mt-1 text-2xl font-black text-neutral-950">{completionRate}%</p>
              </div>
            </div>
          </motion.section>
        </div>

        {assignments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-neutral-950">Aktuelle Einsätze</h2>
              <span className="text-xs text-neutral-500">kompakt</span>
            </div>
            <div className="grid gap-3">
              {assignments.slice(0, 3).map((assignment, idx) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.28 + idx * 0.08 }}
                  className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white/92 p-4"
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
          </div>
        )}
      </div>
    </div>
  );
}
