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

export const formatTravelMinutes = (minutes?: number | null) =>
  minutes == null || Number.isNaN(minutes) ? 'Fahrzeit nicht verfügbar' : `ca. ${minutes} Min. zum Job`;

export const getTravelMetrics = async (origin: string, destination: string) => {
  const google = await loadGoogleMaps();
  return new Promise<{ distanceText: string; durationMinutes: number | null }>((resolve, reject) =>
    new google.maps.DistanceMatrixService().getDistanceMatrix(
      { origins: [origin], destinations: [destination], travelMode: google.maps.TravelMode.DRIVING, unitSystem: google.maps.UnitSystem.METRIC },
      (response: any, status: string) => {
        const element = response?.rows?.[0]?.elements?.[0];
        if (status !== 'OK' || !element || element.status !== 'OK') return reject(new Error(element?.status ?? status));
        resolve({
          distanceText: element.distance?.text ?? 'Entfernung nicht verfügbar',
          durationMinutes: typeof element.duration?.value === 'number' ? Math.max(1, Math.round(element.duration.value / 60)) : null,
        });
      }
    )
  );
};
