import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes, Qibla } from 'adhan';

export interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  city: string | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    city: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          city: 'Current Location',
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation(prev => ({ ...prev, loading: false, error: error.message }));
      }
    );
  }, []);

  return { location, setLocation };
}

export function usePrayerData(coords: { latitude: number; longitude: number } | null, method: string = 'MuslimWorldLeague') {
  const [data, setData] = useState<{
    prayerTimes: PrayerTimes | null;
    sunnahTimes: SunnahTimes | null;
    qiblaDirection: number | null;
  }>({
    prayerTimes: null,
    sunnahTimes: null,
    qiblaDirection: null,
  });

  useEffect(() => {
    if (!coords) return;

    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const params = (CalculationMethod as any)[method]();
    const date = new Date();
    
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    const sunnahTimes = new SunnahTimes(prayerTimes);
    const qiblaDirection = Qibla(coordinates);

    setData({ prayerTimes, sunnahTimes, qiblaDirection });

    // Update every minute
    const interval = setInterval(() => {
      const newDate = new Date();
      setData({
        prayerTimes: new PrayerTimes(coordinates, newDate, params),
        sunnahTimes: new SunnahTimes(new PrayerTimes(coordinates, newDate, params)),
        qiblaDirection: Qibla(coordinates),
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [coords, method]);

  return data;
}
