import type { MapMarker } from '../../../components/GoogleAreaMap';
import { User } from '../../../types';

export type GeoSource = 'coordinates' | 'address' | 'none';

export const DEFAULT_CENTER: [number, number] = [52.52, 13.405];

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

export const isCoordinatePair = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]));

export const formatAddress = (address?: User['address']) =>
  [
    [address?.street, address?.streetNumber].filter(Boolean).join(' ').trim(),
    [address?.zipCode, address?.city].filter(Boolean).join(' ').trim(),
  ]
    .filter(Boolean)
    .join(', ');

export const resolveUserCenter = (user?: User): { position: [number, number] | null; source: GeoSource } => {
  if (!user) return { position: null, source: 'none' };

  const { coordinates } = user;
  if (coordinates && Number.isFinite(Number(coordinates.lat)) && Number.isFinite(Number(coordinates.lng))) {
    return { position: [Number(coordinates.lat), Number(coordinates.lng)], source: 'coordinates' };
  }

  return { position: null, source: formatAddress(user.address) ? 'address' : 'none' };
};

export const createCurrentUserMarker = (address: string, position?: [number, number]): MapMarker[] =>
  !address
    ? []
    : [{
        id: 'current-user-marker',
        position,
        address,
        color: 'var(--map-user-area-stroke)',
        kind: 'user',
        title: 'Das sind Sie 👋',
        content: `<div class="w-56 text-sm"><div class="font-bold">Das sind Sie 👋</div><div style="margin-top:4px;color:#6b7280">${escapeHtml(address)}</div></div>`,
      }];

export const distanceByZip = (left?: string, right?: string) =>
  Math.abs((parseInt(left || '0', 10) || 0) - (parseInt(right || '0', 10) || 0)) * 10;

export const TASK_RADIUS_M = 500;