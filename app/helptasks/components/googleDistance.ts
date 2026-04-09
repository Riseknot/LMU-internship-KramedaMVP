declare global {
  interface Window { google?: any; __googleMapsLoader?: Promise<any>; }
}

const loadGoogleMaps = async () => {
  if (typeof window === 'undefined') throw new Error('Browser only');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY fehlt.');
  if (window.google?.maps) return window.google;

  return (window.__googleMapsLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  }));
};

const formatModeTime = (label: string, minutes?: number | null) =>
  `${label}: ${minutes == null || Number.isNaN(minutes) ? '—' : `ca. ${minutes} Min.`}`;

export const getTravelMetrics = async (origin: string, destination: string) => {
  const google = await loadGoogleMaps();
  const service = new google.maps.DistanceMatrixService();
  const readMode = (travelMode: any) =>
    new Promise<{ distanceText: string | null; durationMinutes: number | null }>((resolve) =>
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode,
          unitSystem: google.maps.UnitSystem.METRIC,
          ...(travelMode === google.maps.TravelMode.TRANSIT ? { transitOptions: { departureTime: new Date() } } : {}),
        },
        (response: any, status: string) => {
          const element = response?.rows?.[0]?.elements?.[0];
          if (status !== 'OK' || !element || element.status !== 'OK') return resolve({ distanceText: null, durationMinutes: null });
          resolve({
            distanceText: element.distance?.text ?? null,
            durationMinutes: typeof element.duration?.value === 'number' ? Math.max(1, Math.round(element.duration.value / 60)) : null,
          });
        }
      )
    );

  const [driving, walking, transit] = await Promise.all([
    readMode(google.maps.TravelMode.DRIVING),
    readMode(google.maps.TravelMode.WALKING),
    readMode(google.maps.TravelMode.TRANSIT),
  ]);

  return {
    distanceText: driving.distanceText ?? walking.distanceText ?? transit.distanceText ?? 'Entfernung nicht verfügbar',
    travelTimesText: [
      formatModeTime('Auto', driving.durationMinutes),
      formatModeTime('Bahn', transit.durationMinutes),
      formatModeTime('Zu Fuß', walking.durationMinutes),
    ].join(' • '),
  };
};
