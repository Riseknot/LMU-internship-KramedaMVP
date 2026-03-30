import React from "react";
import { Helptask } from "../services/helptaskService";

interface HelptaskListViewProps {
  helptasks: Helptask[];
  loading?: boolean;
  error?: string | null;
  onSelectTask?: (task: Helptask) => void;
  onUpdateStatus?: (taskId: string, status: "open" | "assigned" | "completed") => void;
}

const STATUS_STYLES: Record<Helptask["status"], string> = {
  open: "bg-secondary-100 text-secondary-800 border-secondary-200",
  assigned: "bg-primary-100 text-primary-800 border-primary-200",
  completed: "bg-success/15 text-success border-success/30",
};

const STATUS_CARD_STYLES: Record<Helptask["status"], string> = {
  open: "border-l-secondary-500",
  assigned: "border-l-primary-600",
  completed: "border-l-success",
};

const STATUS_LABELS: Record<Helptask["status"], string> = {
  open: "Offen",
  assigned: "Zugewiesen",
  completed: "Abgeschlossen",
};

export function HelptaskListView({
  helptasks,
  loading = false,
  error = null,
  onSelectTask,
  onUpdateStatus,
}: HelptaskListViewProps) {
  const formatDateTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return "-";
    }

    const dateLabel = startDate.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const startTimeLabel = startDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTimeLabel = endDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateLabel}, ${startTimeLabel} - ${endTimeLabel}`;
  };

  if (loading) {
    return <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-600">Lade Hilfeleistungen...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-error/30 bg-error/10 p-6 text-error">{error}</div>;
  }

  if (!helptasks.length) {
    return <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-600">Keine Hilfeleistungen vorhanden.</div>;
  }

  return (
    <div className="space-y-3">
      {helptasks.map((task) => (
        <div
          key={task._id}
          className={`rounded-2xl border border-neutral-200 border-l-4 bg-white/95 p-4 shadow-sm transition-colors hover:border-neutral-300 md:p-5 ${STATUS_CARD_STYLES[task.status]}`}
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 md:text-lg">{task.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{task.description}</p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 rounded-xl border border-neutral-200 bg-neutral-50/90 p-3 text-sm text-neutral-600 md:grid-cols-2">
            <p><span className="font-medium text-neutral-800">Ort:</span> {task.address?.zipCode || "-"} {task.address?.city || ""}</p>
            <p><span className="font-medium text-neutral-800">Zeitfenster:</span> {formatDateTimeRange(task.start, task.end)}</p>
            <p><span className="font-medium text-neutral-800">Ersteller:</span> {task.firstname} {task.surname}</p>
            <p><span className="font-medium text-neutral-800">Typ:</span> {task.taskType}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-3">
            <p className="text-xs font-medium text-neutral-500">Nächster Schritt</p>

            <div className="flex flex-wrap gap-2">
              {onSelectTask && (
                <button
                  onClick={() => onSelectTask(task)}
                  className="btn-base btn-ghost px-3 py-1.5 text-sm"
                >
                  Details
                </button>
              )}

              {onUpdateStatus && task.status !== "assigned" && (
                <button
                  onClick={() => onUpdateStatus(task._id, "assigned")}
                  className="btn-base btn-primary px-3 py-1.5 text-sm"
                >
                  Zuweisen
                </button>
              )}

              {onUpdateStatus && task.status !== "completed" && (
                <button
                  onClick={() => onUpdateStatus(task._id, "completed")}
                  className="btn-base btn-secondary px-3 py-1.5 text-sm"
                >
                  Abschließen
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

