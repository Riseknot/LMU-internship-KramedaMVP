export const geocodeAddress = (google: any, address: string): Promise<[number, number] | null> => {
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