import { User } from '../../../types';

export type GeoSource = 'coordinates' | 'address' | 'none';

export const DEFAULT_CENTER: [number, number] = [52.52, 13.405];

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const fallbackAddressCenter = (parts: Array<string | undefined>): [number, number] | null => {
  const normalized = parts.filter(Boolean).join('|').trim().toLowerCase();
  if (!normalized) return null;

  const seed = hashString(normalized);
  return [DEFAULT_CENTER[0] + (((seed % 200) - 100) * 0.0015), DEFAULT_CENTER[1] + (((Math.floor(seed / 200) % 200) - 100) * 0.0015)];
};

export const isCoordinatePair = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]));

export const resolveUserCenter = (user?: User): { position: [number, number] | null; source: GeoSource } => {
  if (!user) return { position: null, source: 'none' };

  const { coordinates } = user;
  if (coordinates && Number.isFinite(coordinates.lat) && Number.isFinite(coordinates.lng)) {
    return { position: [coordinates.lat, coordinates.lng], source: 'coordinates' };
  }

  const fallback = fallbackAddressCenter([user.address?.zipCode, user.address?.city, user.address?.street, user.address?.streetNumber, user.email]);
  return fallback ? { position: fallback, source: 'address' } : { position: null, source: 'none' };
};

export const distanceByZip = (left?: string, right?: string) =>
  Math.abs((parseInt(left || '0', 10) || 0) - (parseInt(right || '0', 10) || 0)) * 10;