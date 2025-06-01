import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useWeather } from "../hooks/useWeather";

export const getWeatherIcon = (weather: string, weatherColor: string, size: number = 30) => {
  const { lastWeatherForecast } = useWeather();
  return (
    <>
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Clouds' && (
          <MaterialCommunityIcons name="weather-cloudy" size={size} color={weatherColor} />
        )
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Clear' && ((new Date().getHours() > 6 && new Date().getHours() < 18) && (
          <MaterialCommunityIcons name="weather-sunny" size={size} color={weatherColor} />
        ))
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Clear' && ((new Date().getHours() < 6 || new Date().getHours() > 18) && (
          <MaterialCommunityIcons name="weather-night" size={size} color={weatherColor} />
        ))
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Rain' && (
          <MaterialCommunityIcons name="weather-rainy" size={size} color={weatherColor} />
        )
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Snow' && (
          <MaterialCommunityIcons name="weather-snowy" size={size} color={weatherColor} />
        )
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Thunderstorm' && (
          <MaterialCommunityIcons name="weather-lightning" size={size} color={weatherColor} />
        )
      }
      {
        lastWeatherForecast?.list[0]?.weather[0]?.main === 'Mist' && (
          <MaterialCommunityIcons name="weather-fog" size={size} color={weatherColor} />
        )
      }
    </>
  );
}

export const getWeatherCondition = (weather: string) => {
  const { lastWeatherForecast } = useWeather();
  return lastWeatherForecast?.list[0]?.weather[0]?.main === 'Clouds' ? 'Облачно' : lastWeatherForecast?.list[0]?.weather[0]?.main === 'Clear' ? 'Ясно' : lastWeatherForecast?.list[0]?.weather[0]?.main === 'Rain' ? 'Дождь' : lastWeatherForecast?.list[0]?.weather[0]?.main === 'Snow' ? 'Снег' : lastWeatherForecast?.list[0]?.weather[0]?.main === 'Thunderstorm' ? 'Гроза' : lastWeatherForecast?.list[0]?.weather[0]?.main === 'Mist' ? 'Туман' : '';
}
