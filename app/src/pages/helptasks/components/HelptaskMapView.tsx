import React, { useMemo } from 'react';
import { GoogleAreaMap, MapArea } from '../../../components/GoogleAreaMap';
import { Helptask } from '../../../services/helptaskService';
import { User } from '../../../types';
import { DEFAULT_CENTER, escapeHtml, fallbackAddressCenter, isCoordinatePair, resolveUserCenter } from './utils';

interface HelptaskMapViewProps {
  currentUser: User;
  helptasks: Helptask[];
}

const TASK_RADIUS_M = 1400;
const TASK_FALLBACK_RADIUS_M = 2600;
const USER_RADIUS_M = 1500;

const resolveTaskArea = (task: Helptask) => {
  const coords = task.public_loc?.coordinates ?? task.public_log?.coordinates ?? task.location?.coordinates;

  if (isCoordinatePair(coords) && !(Number(coords[0]) === 0 && Number(coords[1]) === 0)) {
    return { position: [Number(coords[1]), Number(coords[0])] as [number, number], source: 'public', radius: TASK_RADIUS_M };
  }

  const fallback = fallbackAddressCenter([task.address?.zipCode, task.address?.city, task.title]);
  return fallback
    ? { position: fallback, source: 'address', radius: TASK_FALLBACK_RADIUS_M }
    : { position: null, source: 'none', radius: TASK_FALLBACK_RADIUS_M };
};

export function HelptaskMapView({ currentUser, helptasks }: HelptaskMapViewProps) {
  const { position: userPosition } = resolveUserCenter(currentUser);

  const taskAreas = useMemo(
    () =>
      helptasks
        .map((task) => ({ task, ...resolveTaskArea(task) }))
        .filter((item): item is { task: Helptask; position: [number, number]; source: string; radius: number } => item.position !== null),
    [helptasks]
  );

  const center = userPosition || taskAreas[0]?.position || DEFAULT_CENTER;

  const areas = useMemo<MapArea[]>(
    () => [
      ...(userPosition
        ? [{ id: 'current-user', center: userPosition, radius: USER_RADIUS_M, strokeColor: 'var(--map-user-area-stroke)', fillColor: 'var(--map-user-area-fill)', content: '<div class="text-sm font-semibold">Ihr Bereich</div>' }]
        : []),
      ...taskAreas.map(({ task, position, radius }) => ({
        id: task._id,
        center: position,
        radius,
        strokeColor: 'var(--map-helptask-area-stroke)',
        fillColor: 'var(--map-helptask-area-fill)',
        content: `<div class="w-56 text-sm"><p class="font-semibold">${escapeHtml(task.title)}</p><p style="margin:4px 0 0">${escapeHtml(task.description)}</p><p style="margin:8px 0 0;font-size:12px;color:#6b7280">Bereich: ${escapeHtml(task.address?.zipCode || '-')} ${escapeHtml(task.address?.city || '')}</p><p style="margin:4px 0 0;font-size:12px;color:#0f766e">Status: ${escapeHtml(task.status)}</p></div>`,
      })),
    ],
    [taskAreas, userPosition]
  );

  return (
    <div className="space-y-3">
      <div className="relative h-96 w-full overflow-hidden rounded-xl border border-neutral-200">
        <GoogleAreaMap center={center} areas={areas} className="h-full w-full" />

        {!userPosition && !taskAreas.length && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/80">
            <p className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
              Keine Bereiche gefunden.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-500">Es wird nur ein Bereich angezeigt – nicht die exakte Adresse.</p>
    </div>
  );
}
