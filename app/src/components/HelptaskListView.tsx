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
  open: "bg-blue-100 text-blue-700",
  assigned: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

export function HelptaskListView({
  helptasks,
  loading = false,
  error = null,
  onSelectTask,
  onUpdateStatus,
}: HelptaskListViewProps) {
  if (loading) {
    return <div className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-600">Lade Hilfeleistungen...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  if (!helptasks.length) {
    return <div className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-600">Keine Hilfeleistungen vorhanden.</div>;
  }

  return (
    <div className="space-y-3">
      {helptasks.map((task) => (
        <div
          key={task._id}
          className="rounded-xl border border-neutral-200 bg-white p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{task.title}</h3>
              <p className="text-sm text-neutral-600">{task.description}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[task.status]}`}>
              {task.status}
            </span>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-neutral-600 md:grid-cols-2">
            <p>
              <span className="font-medium text-neutral-800">Ort:</span> {task.address?.zipCode || "-"} {task.address?.city || ""}
            </p>
            <p>
              <span className="font-medium text-neutral-800">Zeit:</span> {task.startTime} - {task.endTime}
            </p>
            <p>
              <span className="font-medium text-neutral-800">Ersteller:</span> {task.firstname} {task.surname}
            </p>
            <p>
              <span className="font-medium text-neutral-800">Typ:</span> {task.taskType}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {onSelectTask && (
              <button
                onClick={() => onSelectTask(task)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Details
              </button>
            )}

            {onUpdateStatus && task.status !== "assigned" && (
              <button
                onClick={() => onUpdateStatus(task._id, "assigned")}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
              >
                Als zugewiesen markieren
              </button>
            )}

            {onUpdateStatus && task.status !== "completed" && (
              <button
                onClick={() => onUpdateStatus(task._id, "completed")}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Als abgeschlossen markieren
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
