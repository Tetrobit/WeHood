import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useWeather } from "../hooks/useWeather";

export const getWeatherIcon = (weather: string, weatherColor: string, size: number = 30) => {
  return (
    <>
      {
        weather === 'Clouds' && (
          <MaterialCommunityIcons name="weather-cloudy" size={size} color={weatherColor} />
        )
      }
      {
        weather === 'Clear' && ((new Date().getHours() > 6 && new Date().getHours() < 18) && (
          <MaterialCommunityIcons name="weather-sunny" size={size} color={weatherColor} />
        ))
      }
      {
        weather === 'Clear' && ((new Date().getHours() < 6 || new Date().getHours() > 18) && (
          <MaterialCommunityIcons name="weather-night" size={size} color={weatherColor} />
        ))
      }
      {
        weather === 'Rain' && (
          <MaterialCommunityIcons name="weather-rainy" size={size} color={weatherColor} />
        )
      }
      {
        weather === 'Snow' && (
          <MaterialCommunityIcons name="weather-snowy" size={size} color={weatherColor} />
        )
      }
      {
        weather === 'Thunderstorm' && (
          <MaterialCommunityIcons name="weather-lightning" size={size} color={weatherColor} />
        )
      }
      {
        weather === 'Mist' && (
          <MaterialCommunityIcons name="weather-fog" size={size} color={weatherColor} />
        )
      }
    </>
  );
}

const weatherConditions = {
  Clouds: 'Облачно',
  Clear: 'Ясно',
  Rain: 'Дождь',
  Snow: 'Снег',
  Thunderstorm: 'Гроза',
}
export const getWeatherCondition = (weather: string) => {
  return weatherConditions[weather as keyof typeof weatherConditions] || '';
}

const days = {
  'понедельник': 'Пн',
  'вторник': 'Вт',
  'среда': 'Ср',
  'четверг': 'Чт',
  'пятница': 'Пт',
  'суббота': 'Сб',
  'воскресенье': 'Вс',
}

export const getShortDay = (day: string) => {
  return days[day.toLowerCase() as keyof typeof days] || '';
}

