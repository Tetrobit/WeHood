import { useState } from 'react';
import * as Location from 'expo-location';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestGeolocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg('Error getting location');
    }
  };

  return {
    location,
    errorMsg,
    requestGeolocation,
  };
};

export default useGeolocation; 