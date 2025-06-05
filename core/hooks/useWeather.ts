import React, { useState } from 'react';
import * as Location from 'expo-location';
import { useQuery, useRealm } from '@realm/react';
import { useApi, WeatherForecastResponse } from '@/core/hooks/useApi';
import GeolocationModel from '@/core/models/GeolocationModel';
import WeatherForecastModel from '@/core/models/WeatherForecastModel';
import useGeolocation from './useGeolocation';

export const useWeather = () => {
  const api = useApi();
  const realm = useRealm();
  const { lastLocation } = useGeolocation();
  const [lastWeatherForecastRecord] = useQuery({
    type: WeatherForecastModel,
    query: (realm) => realm.sorted('timestamp', true),
  });

  const lastWeatherForecast = React.useMemo<WeatherForecastResponse>(() => {
    return JSON.parse(lastWeatherForecastRecord?.response || '{}');
  }, [lastWeatherForecastRecord]);

  React.useEffect(() => {
    let timeout: number | null = null;
    const getWeather = async () => {
      timeout = null;
      try {
        const weather = await api.getWeatherForecast(lastLocation.latitude, lastLocation.longitude);
        console.log("get weather");
        if (weather.error) throw new Error(weather.error);
        realm.write(() => {
          realm.create(WeatherForecastModel, WeatherForecastModel.generate(JSON.stringify(weather)));
        });
      } catch (error) {
        console.log('Error: getWeather', error);
      }
    }

    const checkUpdate = () => {
      if (!lastWeatherForecastRecord || lastWeatherForecastRecord.timestamp.getTime() + 1000 * 60 * 5 * 1 < lastLocation.timestamp.getTime() || (lastWeatherForecastRecord && (Date.now() - lastWeatherForecastRecord.timestamp.getTime()) > 1000 * 60 * 60 * 1)) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(getWeather, 1000);
      }
    }

    checkUpdate();
    let interval = setInterval(() => {
      checkUpdate();
    }, 1000 * 60 * 5 * 1);

    return () => {
      clearInterval(interval);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [lastLocation]);


  return {
    lastWeatherForecast,
    lastWeatherForecastRecord,
  };
};

export default useWeather;
