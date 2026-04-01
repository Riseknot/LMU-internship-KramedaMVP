'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    __googleMapsLoader?: Promise<any>;
  }
}

export type MapArea = {
  id: string;
  center: [number, number];
  radius: number;
  strokeColor?: string;
  fillColor?: string;
  content?: string;
  onClick?: () => void;
};

const MAP_STYLES = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
];

const loadGoogleMaps = (key: string) => {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'));
  if (window.google?.maps) return Promise.resolve(window.google);

  return (window.__googleMapsLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  }));
};

const resolveMapColor = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;

  const match = value.trim().match(/^var\((--[^)]+)\)$/);
  if (!match || typeof window === 'undefined') return value;

  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || fallback;
};

export function GoogleAreaMap({
  center,
  areas,
  zoom = 12,
  className = 'h-full w-full',
}: {
  center: [number, number];
  areas: MapArea[];
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const signature = useMemo(() => JSON.stringify({ center, zoom, areas }), [center, zoom, areas]);

  useEffect(() => {
    if (!apiKey) {
      setError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY fehlt.');
      return;
    }

    let disposed = false;
    const overlays: Array<{ setMap?: (map: null) => void }> = [];

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (disposed || !ref.current) return;

        const map = new google.maps.Map(ref.current, {
          center: { lat: center[0], lng: center[1] },
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: MAP_STYLES,
        });

        const info = new google.maps.InfoWindow();

        areas.forEach((area) => {
          const strokeColor = resolveMapColor(area.strokeColor, '#14b8a6');
          const fillColor = resolveMapColor(area.fillColor, strokeColor);

          const circle = new google.maps.Circle({
            map,
            center: { lat: area.center[0], lng: area.center[1] },
            radius: area.radius,
            strokeColor,
            fillColor,
            fillOpacity: 0.2,
            strokeOpacity: 0.9,
            strokeWeight: 2,
          });

          if (area.content || area.onClick) {
            circle.addListener('click', () => {
              if (area.content) {
                info.setContent(area.content);
                info.setPosition({ lat: area.center[0], lng: area.center[1] });
                info.open({ map });
              }
              area.onClick?.();
            });
          }

          overlays.push(circle);
        });
      })
      .catch(() => setError('Google Maps konnte nicht geladen werden.'));

    return () => {
      disposed = true;
      overlays.forEach((overlay) => overlay.setMap?.(null));
    };
  }, [apiKey, signature]);

  return error ? (
    <div className={`grid place-items-center bg-neutral-50 text-sm text-neutral-500 ${className}`}>
      {error}
    </div>
  ) : (
    <div ref={ref} className={className} />
  );
}
