'use client';

import type { ReactNode } from 'react';
import { BadgeCheck, CalendarDays, Car, Clipboard, Clock, Footprints, HeartHandshake, Mail, MapPin, Route, ShieldCheck, TrainFront, X } from 'lucide-react';

type Address = { zipCode?: string; city?: string; street?: string; streetNumber?: string };
export type HelptaskStatus = 'open' | 'assigned' | 'completed';
export type CreatorProfile = {
  firstname?: string; surname?: string; email?: string; avatarUrl?: string; phone?: string; bio?: string;
  role?: string; languages?: string[]; address?: Pick<Address, 'zipCode' | 'city'>;
};
export type HelptaskDetail = {
  _id: string; taskType?: string; title: string; description: string; start?: string; end?: string;
  createdAt?: string; updatedAt?: string; status: HelptaskStatus; firstname?: string; surname?: string;
  email?: string; createdBy?: CreatorProfile | string | null; address?: Address;
  public_loc?: { lat?: number; lng?: number; radiusM?: number };
};

const STATUS_META: Record<HelptaskStatus, { label: string; badge: string; note: string }> = {
  open: { label: 'Offen', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', note: 'Aktuell werden passende Helfer:innen gesucht.' },
  assigned: { label: 'In Abstimmung', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', note: 'Die Aufgabe wird bereits koordiniert.' },
  completed: { label: 'Abgeschlossen', badge: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200', note: 'Diese Unterstützung wurde bereits erfolgreich beendet.' },
};

const isCreator = (value: unknown): value is CreatorProfile => typeof value === 'object' && value !== null;
const formatDateTime = (value?: string) => {
  const date = value ? new Date(value) : null;
  return !date || Number.isNaN(date.getTime()) ? 'Nach Absprache' : new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};
const formatShortDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return !date || Number.isNaN(date.getTime()) ? 'Nicht angegeben' : new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date);
};
const formatDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Flexibel planbar';
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(diff) || diff <= 0) return 'Flexibel planbar';
  const totalMinutes = Math.round(diff / 60000), hours = Math.floor(totalMinutes / 60), minutes = totalMinutes % 60;
  if (hours >= 24) return `ca. ${Math.round(hours / 24)} Tag${Math.round(hours / 24) === 1 ? '' : 'e'}`;
  if (!hours) return `${totalMinutes} Min.`;
  return minutes ? `ca. ${hours} Std. ${minutes} Min.` : `ca. ${hours} Std.`;
};
const getInitials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'LU';
const buildMailHref = (email: string, name: string, title: string) =>
  `mailto:${email}?subject=${encodeURIComponent(`Interesse an Helptask: ${title}`)}&body=${encodeURIComponent(`Hallo ${name},%0D%0A%0D%0Aich interessiere mich für die Helptask "${title}" und würde gerne mehr erfahren.%0D%0A%0D%0AViele Grüße`)}`;
const getCreatorData = (task: HelptaskDetail) => {
  const creator = isCreator(task.createdBy) ? task.createdBy : null;
  const creatorName = [creator?.firstname ?? task.firstname, creator?.surname ?? task.surname].filter(Boolean).join(' ') || 'Lumi Community';
  return {
    creator,
    creatorName,
    creatorEmail: creator?.email ?? task.email ?? 'Kontakt auf Anfrage',
    creatorPhone: creator?.phone ?? 'Wird nach Kontaktfreigabe geteilt',
    creatorRole: creator?.role ?? 'Angehörige:r / organisierende Person',
    creatorLocation: [creator?.address?.zipCode ?? task.address?.zipCode, creator?.address?.city ?? task.address?.city].filter(Boolean).join(' • ') || 'Region wird erst nach Freigabe detailliert angezeigt',
    creatorBio: creator?.bio ?? 'Hier steht die Bio der Person. Wenn diese nicht ausgefüllt ist, steht erstmal noch dieser Text hier: Dieses Profil schreibt noch an seiner Geschichte.',
    creatorAvatar: creator?.avatarUrl,
    creatorInitials: getInitials(creatorName),
    mailHref: buildMailHref(creator?.email ?? task.email ?? 'Kontakt auf Anfrage', creatorName, task.title),
  };
};

type CardProps = { icon?: ReactNode; label: string; value: ReactNode; hint?: ReactNode; compact?: boolean };
const TravelModeBadges = ({ text }: { text: string }) => {
  const modeIcons = {
    "Auto": { icon: <Car className="h-3.5 w-3.5" />, tone: 'bg-slate-100 text-slate-700' },
    "Zu Fuß": { icon: <Footprints className="h-3.5 w-3.5" />, tone: 'bg-emerald-50 text-emerald-700' },
    "Bahn": { icon: <TrainFront className="h-3.5 w-3.5" />, tone: 'bg-sky-50 text-sky-700' },
  } as const;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {text.split(' • ').map((entry) => {
        const [label, value = '—'] = entry.split(': ');
        const meta = modeIcons[label as keyof typeof modeIcons] ?? { icon: <Route className="h-3.5 w-3.5" />, tone: 'bg-slate-100 text-slate-700' };
        return (
          <span key={entry} className={` group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${meta.tone}`}>
            {meta.icon}
            <span>{value}</span>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
                {label}
              </span>
          </span>
        );
      })}
    </div>
  );
};
const Card = ({ icon, label, value, hint, compact = false }: CardProps) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white ${compact ? 'p-3' : 'p-4'}`}>
    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-secondary-600 shadow-sm">{icon}</div>
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
    <div className="leading-relaxed mt-1 text-xs sm:text-base text-slate-800">{value}</div>
    {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
  </div>
);

export function HelptaskErrorState({ message, onGoDashboard }: { message: string; onGoDashboard: () => void }) {
  return (
    <section className="rounded-[28px] border border-red-100 bg-white/90 p-6 shadow-lg shadow-red-100/40">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-red-50 p-2 text-red-600"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Helptask momentan nicht verfügbar</h1>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
          <button type="button" onClick={onGoDashboard} className="mt-4 inline-flex rounded-full bg-secondary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600">Zur Übersicht</button>
        </div>
      </div>
    </section>
  );
}

export function HelptaskDetailContent({ helptaskData, distanceText, travelTimeText, onOpenProfile }: { helptaskData: HelptaskDetail; distanceText: string; travelTimeText: string; onOpenProfile: () => void }) {
  const creatorData = getCreatorData(helptaskData);
  const publicArea = [helptaskData.address?.zipCode, helptaskData.address?.city].filter(Boolean).join(' ') || 'Diskret nach Kontaktfreigabe';
  const summaryCards = [
    { icon: <CalendarDays className="h-4 w-4" />, label: 'Zeitfenster', value: formatDateTime(helptaskData.start), hint: helptaskData.end ? `bis ${formatDateTime(helptaskData.end)}` : 'Flexible Abstimmung möglich' },
    { icon: <MapPin className="h-4 w-4" />, label: 'Region', value: publicArea, hint: 'Aus Datenschutzgründen ohne exakte Adresse' },
    { icon: <ShieldCheck className="h-4 w-4" />, label: 'Status & Sicherheit', value: STATUS_META[helptaskData.status].note, hint: 'Verifizierter Auftrag' },
  ];
  const processCards = [
    { icon: <MapPin className="h-4 w-4" />, label: 'Ort', value: publicArea, hint: 'Exakte Adresse bleibt geschützt' },
    { icon: <CalendarDays className="h-4 w-4" />, label: 'Termin', value: formatDateTime(helptaskData.start), hint: helptaskData.end ? `Ende: ${formatDateTime(helptaskData.end)}` : 'Zeit flexibel' },
    { icon: <Clock className="h-4 w-4" />, label: 'Dauer', value: formatDuration(helptaskData.start, helptaskData.end) },
    { icon: <Route className="h-4 w-4" />, label: 'Distanz', value: distanceText, hint: <TravelModeBadges text={travelTimeText} /> },
    { icon: <CalendarDays className="h-4 w-4" />, label: 'Vom', value: formatShortDate(helptaskData.createdAt) },
    { icon: <Clipboard className="h-4 w-4" />, label: 'Aufgabentyp', value: helptaskData.taskType || 'Alltagsunterstützung' },
  ];
  const detailRows = [
    { icon: <MapPin className="h-4 w-4" />, label: 'Beschreibung', value: helptaskData.description },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-4xl border border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_META[helptaskData.status].badge}`}>{STATUS_META[helptaskData.status].label}</span>
              <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-100">{helptaskData.taskType || 'Unterstützung im Alltag'}</span>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{formatDuration(helptaskData.start, helptaskData.end)}</span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{helptaskData.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{helptaskData.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{summaryCards.map((card) => <Card key={card.label} {...card} />)}</div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a href={creatorData.mailHref} className="inline-flex items-center justify-center rounded-full bg-secondary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-secondary-500/20 transition hover:-translate-y-0.5 hover:bg-secondary-600">Kontakt aufnehmen</a>
              <button type="button" onClick={onOpenProfile} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-secondary-200 hover:text-secondary-700">Profil ansehen</button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-secondary-100 bg-linear-to-br from-secondary-50 via-white to-primary-50 p-5 shadow-inner shadow-secondary-100/40">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary-200/60 blur-2xl" />
            <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-primary-200/60 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-secondary-700">Erstellt von</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{creatorData.creatorName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{creatorData.creatorRole}</p>
                </div>
                <button type="button" onClick={onOpenProfile} aria-label="Profilinformationen öffnen" className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-secondary-500 via-accent-500 to-primary-500 p-0.5 shadow-lg transition hover:scale-105">
                  <span className="absolute inset-0 rounded-2xl bg-secondary-400/30 blur-md transition group-hover:bg-secondary-500/40" />
                  <span className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-white text-sm font-black text-secondary-700">{creatorData.creatorInitials}</span>
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{creatorData.creatorBio}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary-600" /><span className="truncate">{creatorData.creatorEmail}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary-600" /><span>{creatorData.creatorLocation}</span></div>
              </div>
              <button type="button" onClick={onOpenProfile} className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm font-semibold text-secondary-700 transition hover:border-secondary-300 hover:bg-secondary-100">Profilkarte öffnen</button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <article className="rounded-[28px] border border-white/70 bg-white/85 md:p-5 shadow-lg shadow-slate-200/60 backdrop-blur sm:p-6">
          <h2 className="text-xl font-bold text-slate-900">Aufgabenübersicht</h2>
          <div className="grid gap-3">
            <article className="rounded-[28px] border border-white/70 bg-white/85 md:p-5">
              <div className="mt-4 grid gap-3  sm:grid-cols-3 grid-cols-2">{processCards.map((card) => <Card key={card.label} {...card} />)}</div>
              <div className="pt-6">
                {detailRows.map((row) => <Card key={row.label} {...row} />)}
              </div>
            </article>
          </div>
        </article>
      </section>
    </div>
  );
}

export function CreatorProfileModal({ isOpen, helptaskData, onClose }: { isOpen: boolean; helptaskData: HelptaskDetail | null; onClose: () => void }) {
  if (!isOpen || !helptaskData) return null;
  const creatorData = getCreatorData(helptaskData);
  const modalCards = [
    { label: 'E-Mail', value: creatorData.creatorEmail },
    { label: 'Telefon', value: creatorData.creatorPhone },
    { label: 'Region', value: creatorData.creatorLocation },
    { label: 'Erstellt am', value: formatShortDate(helptaskData.createdAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="creator-profile-title" className="relative w-full max-w-3xl overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-slate-900" aria-label="Profil schließen"><X className="h-4 w-4" /></button>
        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-linear-to-br from-secondary-500 via-accent-500 to-primary-500 p-6 text-white sm:p-8">
            <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
            <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-slate-950/15 blur-2xl" />
            <div className="relative flex h-full flex-col items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-white/80">Profil der erstellenden Person</p>
                <h2 id="creator-profile-title" className="mt-2 text-2xl font-bold">{creatorData.creatorName}</h2>
                <p className="mt-2 text-sm text-white/85">{creatorData.creatorRole}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/35 bg-white/15 shadow-lg backdrop-blur">
                  {creatorData.creatorAvatar ? <img src={creatorData.creatorAvatar} alt={creatorData.creatorName} className="h-full w-full object-cover" /> : <span className="text-3xl font-black text-white">{creatorData.creatorInitials}</span>}
                </div>
                <div className="space-y-2 text-sm text-white/90">
                  {[['Verifizierte Anfrage über die Plattform', <BadgeCheck className="h-4 w-4" key="badge" />], ['Freundliche und klare Kommunikation', <HeartHandshake className="h-4 w-4" key="heart" />]].map(([text, icon]) => (
                    <p key={text as string} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">{icon as ReactNode}{text as string}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">{modalCards.map((card) => <Card key={card.label} {...card} compact />)}</div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Über dieses Profil</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{creatorData.creatorBio}</p>
            </div>
            <div className="mt-5 rounded-2xl border border-secondary-100 bg-secondary-50/60 p-4">
              <p className="text-sm font-semibold text-secondary-800">Verfügbare Angaben</p>
              <p className="mt-2 text-sm leading-6 text-secondary-700">{creatorData.creator?.languages?.length ? `Sprachen: ${creatorData.creator.languages.join(', ')}` : 'Weitere persönliche Details werden bewusst erst bei echtem Kontakt geteilt.'}</p>
            </div>
            <a href={creatorData.mailHref} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-secondary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary-500/20 transition hover:bg-secondary-600">Nachricht senden</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelptaskLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 rounded-4xl bg-white/80 shadow-lg" />
      <div className="grid gap-6 lg:grid-cols-2"><div className="h-52 rounded-[28px] bg-white/80 shadow-lg" /><div className="h-52 rounded-[28px] bg-white/80 shadow-lg" /></div>
    </div>
  );
}
