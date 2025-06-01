import React, { useState } from 'react';
import * as Location from 'expo-location';
import { useQuery, useRealm } from '@realm/react';
import { useApi, WeatherForecastResponse } from '@/core/hooks/useApi';
import Geolocation from '@/core/models/geolocation';
import WeatherForecast from '@/core/models/weather-forecast';

export const useWeather = () => {
  const api = useApi();
  const realm = useRealm();
  const [lastLocation] = useQuery(Geolocation);
  const [lastWeatherForecastRecord] = useQuery({
    type: WeatherForecast,
    query: (realm) => realm.sorted('timestamp', true),
  });

  const lastWeatherForecast = React.useMemo<WeatherForecastResponse>(() => {
    return JSON.parse(lastWeatherForecastRecord?.response || '{}');
  }, [lastWeatherForecastRecord]);

  React.useEffect(() => {
    const getWeather = async () => {
      try {
        const weather = await api.getWeatherForecast(lastLocation.latitude, lastLocation.longitude);
        if (weather.error) throw new Error(weather.error);
        realm.write(() => {
          realm.create(WeatherForecast, WeatherForecast.generate(JSON.stringify(weather)));
        });
      } catch (error) {
        console.log('Error: getWeather', error);
      }
    }

    if (!lastWeatherForecastRecord || (lastWeatherForecastRecord && (Date.now() - lastWeatherForecastRecord.timestamp.getTime()) > 1000 * 60 * 60 * 1)) {
      getWeather();
    }

    let interval = setInterval(() => {
      getWeather();
    }, 1000 * 60 * 60 * 1);

    return () => clearInterval(interval);
  }, [lastLocation]);


  return {
    lastWeatherForecast,
    lastWeatherForecastRecord,
  };
};

export default useWeather;
