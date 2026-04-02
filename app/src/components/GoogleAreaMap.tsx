'use client';

import { useEffect, useRef, useState } from 'react';

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

export type MapMarker = {
  id: string;
  position?: [number, number];
  address?: string;
  title?: string;
  content?: string;
  color?: string;
  kind?: 'default' | 'user';
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

const geocodeAddress = (google: any, address: string): Promise<[number, number] | null> => {
  if (!address.trim()) return Promise.resolve(null);

  return new Promise((resolve) => {
    new google.maps.Geocoder().geocode({ address }, (results: any[], status: string) => {
      const location = results?.[0]?.geometry?.location;
      if (status !== 'OK' || !location) {
        resolve(null);
        return;
      }

      resolve([location.lat(), location.lng()]);
    });
  });
};

const createMarkerIcon = (google: any, color: string, kind: MapMarker['kind'] = 'default') => {
  if (kind === 'user') {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52">
        <path d="M21 2C10.5 2 2 10.5 2 21c0 13.5 15.5 25 19 28.5C24.5 46 40 34.5 40 21 40 10.5 31.5 2 21 2Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="21" cy="17" r="6" fill="#ffffff"/>
        <path d="M12 31c1.8-4.8 5.9-7.5 9-7.5s7.2 2.7 9 7.5" fill="#ffffff"/>
      </svg>`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(42, 52),
      anchor: new google.maps.Point(21, 50),
    };
  }

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
  };
};

export function GoogleAreaMap({
  center,
  areas,
  markers = [],
  zoom = 12,
  className = 'h-full w-full',
}: {
  center: [number, number];
  areas: MapArea[];
  markers?: MapMarker[];
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY fehlt.');
      return;
    }

    let disposed = false;
    const overlays: Array<{ setMap?: (map: null) => void }> = [];

    loadGoogleMaps(apiKey)
      .then(async (google) => {
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
        const bounds = new google.maps.LatLngBounds();

        areas.forEach((area) => {
          const strokeColor = resolveMapColor(area.strokeColor, '#3b82f6');
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

          bounds.extend({ lat: area.center[0], lng: area.center[1] });

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

        await Promise.all(
          markers.map(async (marker) => {
            const position = marker.position ?? (marker.address ? await geocodeAddress(google, marker.address) : null);
            if (!position || disposed) return;

            const mapMarker = new google.maps.Marker({
              map,
              position: { lat: position[0], lng: position[1] },
              title: marker.title,
              icon: createMarkerIcon(google, resolveMapColor(marker.color, '#5e2028'), marker.kind),
              animation: marker.kind === 'user' ? google.maps.Animation.DROP : undefined,
            });

            bounds.extend({ lat: position[0], lng: position[1] });

            if (marker.content || marker.kind === 'user') {
              mapMarker.addListener('click', () => {
                if (marker.kind === 'user') {
                  mapMarker.setAnimation(google.maps.Animation.BOUNCE);
                  window.setTimeout(() => mapMarker.setAnimation(null), 1400);
                }

                if (marker.content) {
                  info.setContent(marker.content);
                  info.open({ map, anchor: mapMarker });
                }
              });
            }

            overlays.push(mapMarker);
          })
        );

        if (!disposed && !bounds.isEmpty()) {
          map.fitBounds(bounds, 48);
          if (areas.length + markers.length === 1) {
            map.setZoom(Math.max(zoom, 14));
          }
        }
      })
      .catch(() => setError('Google Maps konnte nicht geladen werden.'));

    return () => {
      disposed = true;
      overlays.forEach((overlay) => overlay.setMap?.(null));
    };
  }, [apiKey, center, zoom, areas, markers]);

  return error ? (
    <div className={`grid place-items-center bg-neutral-50 text-sm text-neutral-500 ${className}`}>
      {error}
    </div>
  ) : (
    <div ref={ref} className={className} />
  );
}
