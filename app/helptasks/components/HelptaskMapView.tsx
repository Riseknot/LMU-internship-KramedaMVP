import React, { useMemo } from 'react';
import { GoogleAreaMap, MapArea, MapMarker } from './GoogleAreaMap';
import { Helptask } from '../../src/services/helptaskService';
import { User } from '../../src/types';
import { DEFAULT_CENTER, createCurrentUserMarker, escapeHtml, formatAddress, isCoordinatePair, resolveUserCenter, TASK_RADIUS_M } from './utils';

interface HelptaskMapViewProps {
  currentUser: User;
  helptasks: Helptask[];
}

const resolveTaskArea = (task: Helptask) => {
  const coords = task.public_loc;

  if (
    coords &&
    Number.isFinite(Number(coords.lat)) &&
    Number.isFinite(Number(coords.lng)) &&
    !(Number(coords.lat) === 0 && Number(coords.lng) === 0)
  ) {
    return {
      position: [Number(coords.lat), Number(coords.lng)] as [number, number],
      radius: Number.isFinite(Number(coords.radiusM)) && Number(coords.radiusM) > 0 ? Number(coords.radiusM) : TASK_RADIUS_M,
    };
  }

  if (isCoordinatePair(coords) && !(Number(coords[0]) === 0 && Number(coords[1]) === 0)) {
    return {
      position: [Number(coords[1]), Number(coords[0])] as [number, number],
      radius: TASK_RADIUS_M,
    };
  }

  return { position: null, radius: TASK_RADIUS_M };
};

export function HelptaskMapView({ currentUser, helptasks }: HelptaskMapViewProps) {
  const { position: userPosition } = resolveUserCenter(currentUser);
  const userAddress = formatAddress(currentUser.address);

  const taskAreas = useMemo(
    () =>
      helptasks
        .map((task) => ({ task, ...resolveTaskArea(task) }))
        .filter((item): item is { task: Helptask; position: [number, number]; radius: number } => item.position !== null),
    [helptasks]
  );

  const center = userPosition || taskAreas[0]?.position || DEFAULT_CENTER;

  const areas = useMemo<MapArea[]>(
    () =>
      taskAreas.map(({ task, position, radius }) => ({
        id: task._id,
        center: position,
        radius,
        strokeColor: 'var(--map-helptask-area-stroke)',
        fillColor: 'var(--map-helptask-area-fill)',
        content: `
        <div class="w-56 text-sm">
          <p class="font-semibold">${escapeHtml(task.title)}</p>
          <p style="margin:4px 0 0">${escapeHtml(task.description)}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#6b7280">Bereich: ${escapeHtml(task.address?.zipCode || '-')} ${escapeHtml(task.address?.city || '')}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#1d4ed8">Status: ${escapeHtml(task.status)}</p>
          <a
            href="/helptasks/${encodeURIComponent(task._id)}"
            style="display:inline-block;margin-top:8px;padding:4px 8px;font-size:12px;color:#2563eb;border:1px solid #2563eb;border-radius:4px;background:none;text-decoration:none;cursor:pointer"
          >
            Details ansehen
          </a>
          </div>`,
      })),
    [taskAreas]
  );

  const markers = useMemo<MapMarker[]>(
    () => createCurrentUserMarker(userAddress, userPosition ?? undefined),
    [userAddress, userPosition]
  );

  return (
    <div className="surface-card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-neutral-950">Kartenansicht</h3>
          <p className="text-sm text-neutral-600">Ihr Standort kommt direkt aus der in der DB gespeicherten Adresse.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 font-semibold text-primary-700">Ihr Standort</span>
          <span className="rounded-full border border-secondary-200 bg-secondary-50 px-3 py-1 font-semibold text-secondary-700">Hilfeleistung</span>
        </div>
      </div>

      <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950/90">
        <GoogleAreaMap center={center} areas={areas} markers={markers} className="h-full w-full" />

        {!userAddress && !taskAreas.length && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/80">
            <p className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
              Keine echten Standortdaten gefunden.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-500">Ohne gespeicherte Adresse oder Koordinaten wird kein Marker angezeigt.</p>
    </div>
  );
}
