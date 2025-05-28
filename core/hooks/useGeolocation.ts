import { useState } from 'react';
import * as Location from 'expo-location';
import { useQuery, useRealm } from '@realm/react';
import Geolocation from '@/core/models/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastLocation] = useQuery<Geolocation>({
    type: Geolocation,
    query: (realm) => realm.sorted('timestamp', true),
  });

  const realm = useRealm();

  const requestGeolocation = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Разрешение на доступ к геолокации было отклонено');
        return false;
      }

      const location = await Location.getCurrentPositionAsync({});

      setLocation(location);
      realm.write(() => {
        realm.create(Geolocation, Geolocation.generate(location.coords.latitude, location.coords.longitude, new Date()));
      });

      return true;
    } catch (error) {
      console.error(error);
      setErrorMsg('Ошибка при получении геолокации');
      return false;
    }
  };

  return {
    location,
    errorMsg,
    lastLocation,
    requestGeolocation,
  };
};

export default useGeolocation; 