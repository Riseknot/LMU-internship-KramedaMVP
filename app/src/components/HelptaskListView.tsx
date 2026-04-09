import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { PageLoadingState } from "../../loadingpage/components/PageLoadingState";
import { Helptask } from "../services/helptaskService";

interface HelptaskListViewProps {
  helptasks: Helptask[];
  loading?: boolean;
  error?: string | null;
  onSelectTask?: (task: Helptask) => void;
  onUpdateStatus?: (taskId: string, status: Helptask["status"]) => void;
}

type InfoTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const STATUS_META: Record<
  Helptask["status"],
  {
    label: string;
    chip: string;
    card: string;
    strip: string;
    note: string;
    aside: string;
  }
> = {
  open: {
    label: "Jetzt verfügbar",
    chip: "border-secondary-200 bg-secondary-50 text-secondary-800",
    card: "border-neutral-200 bg-white/95 hover:border-secondary-200 hover:shadow-lg hover:shadow-secondary-100/60",
    strip: "bg-gradient-to-r from-secondary-500 via-accent-500 to-primary-500",
    note: "Klare Anfrage mit direkter Entscheidungsmöglichkeit.",
    aside: "border-secondary-100 bg-secondary-50/60",
  },
  assigned: {
    label: "Bereits angenommen",
    chip: "border-primary-200 bg-primary-100 text-primary-800",
    card: "border-primary-200 bg-gradient-to-br from-primary-50 via-white to-secondary-50 shadow-lg shadow-primary-100/70 ring-2 ring-primary-100",
    strip: "bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500",
    note: "Diese Anfrage ist aktiv in Abstimmung und wird bewusst hervorgehoben.",
    aside: "border-primary-200 bg-white/85",
  },
  completed: {
    label: "Dokumentiert",
    chip: "border-neutral-200 bg-neutral-100 text-neutral-700",
    card: "border-neutral-200 bg-neutral-50/80",
    strip: "bg-neutral-300",
    note: "Nur noch zur Übersicht sichtbar – ohne weitere Aktion.",
    aside: "border-neutral-200 bg-white/70",
  },
};

const STATUS_PRIORITY: Record<Helptask["status"], number> = {
  assigned: 0,
  open: 1,
  completed: 2,
};

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white/85 p-3">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-900  whitespace-pre-line">{value}</p>
    </div>
  );
}

const getInitials = (firstname?: string, surname?: string) =>
  [firstname, surname]
    .filter(Boolean)
    .map((value) => value?.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) || "HC";

const formatDateTimeRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Nach Absprache";
  }

  const dateLabel = startDate.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit"
    // year: "numeric",
  });
  const startTimeLabel = startDate.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeLabel = endDate.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel}\n${startTimeLabel} – ${endTimeLabel}`;
};

const formatDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  if (Number.isNaN(diffInMinutes) || diffInMinutes <= 0) {
    return "Flexibel planbar";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} Min.`;
  }

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return minutes ? `${hours} Std. ${minutes} Min.` : `${hours} Std.`;
};

const formatRelativeDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "gerade veröffentlicht";
  }

  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (Math.abs(diffHours) < 24) {
    return new Intl.RelativeTimeFormat("de", { numeric: "auto" }).format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return new Intl.RelativeTimeFormat("de", { numeric: "auto" }).format(diffDays, "day");
};

export function HelptaskListView({
  helptasks,
  loading = false,
  error = null,
  onSelectTask,
  onUpdateStatus,
}: HelptaskListViewProps) {
  const handleDetails = (task: Helptask) => {
    if (onSelectTask) {
      onSelectTask(task);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.assign(`/helptasks/${task._id}`);
    }
  };

  if (loading) {
    return (
      <PageLoadingState fullScreen={false} subtitle="Wir ordnen gerade passende Hilfsanfragen für dich." />
    );
  }

  if (error) {
    return <div className="rounded-xl border border-error/30 bg-error/10 p-6 text-error">{error}</div>;
  }

  if (!helptasks.length) {
    return <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-600">Keine Hilfeleistungen vorhanden.</div>;
  }

  const sortedTasks = [...helptasks].sort((left, right) => {
    const statusDelta = STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => {
        const statusMeta = STATUS_META[task.status];
        const requesterName = [task.firstname, task.surname].filter(Boolean).join(" ") || "Lumi Community";
        const location = [task.address?.zipCode, task.address?.city].filter(Boolean).join(" ") || "Region nach Freigabe";
        const trustSignals = [
          "Verifizierte Plattform-Anfrage",
          task.address?.city ? "Region transparent angegeben" : "Standort datensparsam geteilt",
          task.start && task.end ? "Zeitfenster klar definiert" : "Termin flexibel abstimmbar",
        ];

        return (
          <article
            key={task._id}
            className={`group relative overflow-hidden rounded-[28px] border p-4 transition-all duration-200 md:p-5 ${statusMeta.card}`}
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 ${statusMeta.strip}`} />

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.chip}`}>
                {statusMeta.label}
              </span>
              <span className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-neutral-700">
                {task.taskType || "Alltagsunterstützung"}
              </span>
              <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold text-white/95">
                {task.status === "assigned" ? "Aktiver Match" : "Schnelle Übersicht"}
              </span>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-4">
                <div>
                  <h3 className="line-clamp-2 text-lg font-bold tracking-[-0.03em] text-neutral-950 md:text-xl">
                    {task.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600 md:text-[15px]">
                    {task.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-secondary-700" />
                    {statusMeta.note}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoTile icon={<MapPin className="h-4 w-4" />} label="Region" value={location} />
                  <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Zeitfenster" value={formatDateTimeRange(task.start, task.end)} />
                  <InfoTile icon={<Clock3 className="h-4 w-4" />} label="Dauer" value={formatDuration(task.start, task.end)} />
                  <InfoTile icon={<UserRound className="h-4 w-4" />} label="Anfrage von" value={requesterName} />
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-white/85 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Vertrauenssignale
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {trustSignals.map((signal) => (
                      <span
                        key={signal}
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                      >
                        <BadgeCheck className="h-3.5 w-3.5 text-secondary-700" />
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <aside className={`rounded-[24px] border p-4 ${statusMeta.aside}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-sm font-bold text-white">
                    {getInitials(task.firstname, task.surname)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Kontaktperson</p>
                    <p className="text-sm font-semibold text-neutral-950">{requesterName}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary-700" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-secondary-700" />
                    <span>{formatRelativeDate(task.createdAt)}</span>
                  </div>
                </div>

                <p className="mt-4 rounded-2xl bg-white/80 px-3 py-2 text-xs leading-5 text-neutral-600">
                  Die exakte Adresse bleibt bis zur Kontaktfreigabe geschützt. Details liefern mehr Kontext für eine sichere Entscheidung.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDetails(task)}
                    className="btn-base btn-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm"
                  >
                    Details
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {onUpdateStatus && task.status === "open" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(task._id, "assigned")}
                      className="btn-base btn-primary px-3.5 py-2 text-sm"
                    >
                      Auftrag annehmen
                    </button>
                  )}
                </div>
              </aside>
            </div>
          </article>
        );
      })}
    </div>
  );
}

