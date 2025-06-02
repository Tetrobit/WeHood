import React, { useState } from 'react';
import * as Location from 'expo-location';
import { useQuery, useRealm } from '@realm/react';
import Geolocation from '@/core/models/geolocation';
import { useApi } from '@/core/hooks/useApi';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const api = useApi();
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
      console.log(location);

      const geocoder = await api.reverseGeocode(location.coords.latitude, location.coords.longitude);

      setLocation(location);
      realm.write(() => {
        realm.create(Geolocation, Geolocation.generate(location.coords.latitude, location.coords.longitude, new Date(), geocoder.attributes));
      });

      
  // useEffect(() => {
  //   const getLocation = async () => {
  //     try {
  //       const response = await Location.requestForegroundPermissionsAsync();
  //       let geo: any = null;

  //       if (response.status === 'granted') {
  //         const position = await Location.getCurrentPositionAsync({
  //           accuracy: Location.Accuracy.Balanced,
  //         });
  //         geo = await reverseGeocode(position.coords.latitude, position.coords.longitude);
  //       }
  //       else {
  //         console.log("By  IP");
  //         const ip = await Network.getIpAddressAsync();
  //         console.log("A",  ip);
  //         const position: any = await ipGeocode();
  //         geo = await reverseGeocode(position.latitude, position.longitude);
  //         console.log(position);
  //       }

  //       console.log(JSON.stringify(geo, null, 2));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   getLocation();
  // }, []);

      return true;
    } catch (error) {
      console.error(error);
      setErrorMsg('Ошибка при получении геолокации');
      return false;
    }
  };

  React.useEffect(() => {
    async function geocode() {
      if (!lastLocation?.geocoded) {
        const geocoder = await api.reverseGeocode(lastLocation.latitude, lastLocation.longitude);
        realm.write(() => {
          lastLocation.geocoded = true;
          lastLocation.country = geocoder.attributes.country;
          lastLocation.province = geocoder.attributes.province;
          lastLocation.locality = geocoder.attributes.locality;
          lastLocation.district = geocoder.attributes.district;
          lastLocation.street = geocoder.attributes.street;
          lastLocation.house = geocoder.attributes.house;
          lastLocation.other = geocoder.attributes.other;
        });
      }
    }

    if (lastLocation) {
      geocode();
    }
  }, [lastLocation]);


  return {
    location,
    errorMsg,
    lastLocation,
    requestGeolocation,
  };
};

export default useGeolocation; 