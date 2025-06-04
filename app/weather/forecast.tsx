import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DARK_THEME, ThemeName, useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import useWeather from '@/core/hooks/useWeather';
import { getShortDay, getWeatherCondition, getWeatherIcon } from '@/core/utils/weather';

interface WeatherMetric {
  value: string;
  label: string;
}

interface DayForecast {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  icon: React.ReactNode;
}

const WeatherDetailsScreen: React.FC = () => {
  const theme = useThemeName();
  const { lastWeatherForecast } = useWeather();

  let forecast: { [key: string]: (typeof lastWeatherForecast.list[number])[] } = {};
  for (let i = 0; i < lastWeatherForecast.list?.length; i++) {
    const day = new Date(lastWeatherForecast.list?.[i].dt_txt).toLocaleDateString('ru-RU', { weekday: 'long' });
    if (Object.hasOwn(forecast, day)) {
      forecast[day].push(lastWeatherForecast.list?.[i]);
    } else {
      forecast[day] = [lastWeatherForecast.list?.[i]];
    }
  }

  let forecastDays = [];
  for (let i = 0; i < Object.keys(forecast).length; i++) {
    let day = Object.keys(forecast)[i];
    let forecastDay = forecast[day];
    let highTemp = Math.round(forecastDay.reduce((acc, curr) => Math.max(acc, curr.main.temp_max), 0) - 273.15);
    let lowTemp = Math.round(forecastDay.reduce((acc, curr) => Math.min(acc, curr.main.temp_min), 1000) - 273.15);
    let condition = getWeatherCondition(forecastDay[0]?.weather[0]?.main);
    let icon = forecastDay[0]?.weather[0]?.main;
    let wind = Math.round(forecastDay.reduce((acc, curr) => acc + curr.wind.speed, 0) / forecastDay.length);
    let humidity = Math.round(forecastDay.reduce((acc, curr) => acc + curr.main.humidity, 0) / forecastDay.length);
    let pop = Math.round(forecastDay.reduce((acc, curr) => acc + curr.pop, 0) / forecastDay.length * 100);
    forecastDays.push({
      day,
      highTemp,
      lowTemp,
      condition,
      icon,
      wind,
      humidity,
      pop,
    });
  }




  const metrics: WeatherMetric[] = [
    { value: `${forecastDays[1]?.wind} км/ч`, label: 'Ветер' },
    { value: `${forecastDays[1]?.humidity}%`, label: 'Влажность' },
    { value: `${forecastDays[1]?.pop}%`, label: 'Осадки' },
  ];

  const weekForecast: DayForecast[] = forecastDays.map((day) => ({
    day: day.day,
    condition: day.condition,
    highTemp: day.highTemp,
    lowTemp: day.lowTemp,
    icon: getWeatherIcon(day.icon, theme === DARK_THEME ? 'white' : 'black', 25),
  }));
  
  const styles = React.useMemo(() => makeStyles(theme!), [theme]);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme === DARK_THEME ? "white" : "black"} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="calendar-outline" size={22} color={theme === DARK_THEME ? "white" : "black"} />
          <Text style={styles.headerText}>7 дней</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={theme === DARK_THEME ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      <ScrollView>
      {/* Tomorrow's Forecast */}
      <LinearGradient colors={['#7C4585', '#C95792']} style={styles.tomorrowContainer}>
        <View style={styles.tomorrowSplitContainer}>
          <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}>
            <View style={styles.tomorrowLeftContainer}>
              {getWeatherIcon(forecastDays[1]?.icon, 'white', 130)}
            </View>
          </Animated.View>

            <View style={styles.tomorrowRightContainer}>
              <View style={styles.mainWeather}>
                <Text style={styles.tomorrowTitle}>Завтра</Text>
                <View style={styles.temperatureContainer}>
                <Text style={styles.mainTemp}>{forecastDays[1]?.highTemp}</Text>
                <Text style={styles.secondaryTemp}>/{forecastDays[1]?.lowTemp}°</Text>
              </View>
              <Text style={styles.weatherCondition}>{forecastDays[1]?.condition}</Text>
            </View>
          </View>
        </View>

        {/* Weather Metrics */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricItem}>
              {index === 0 && (
                <Feather name="wind" size={24} color="white" />
              )}
              {index === 1 && (
                <Ionicons name='water-outline' size={24} color="white" />
              )}
              {index === 2 && (
                <Ionicons name="rainy-outline" size={24} color="white" />
              )}
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.shadow}></View>
      </LinearGradient>

      {/* Weekly Forecast */}
      <View style={styles.weekContainer}>
        {weekForecast.map((day, index) => (
          <View key={index} style={styles.dayRow}>
            <Text style={styles.dayText}>{getShortDay(day.day)}</Text>
            {day.icon}
            <View style={styles.dayIconContainer}>
              <Text style={styles.dayCondition}>{day.condition}</Text>
            </View>
            <Text style={styles.dayHighTemp}>+{day.highTemp}° </Text>
            <Text style={styles.dayLowTemp}>+{day.lowTemp}°</Text>
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeName) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: theme === DARK_THEME ? '#000000' : '#FFFFFF',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: theme === DARK_THEME ? "white" : "black",
    fontSize: 22,
    fontWeight: '600',
  },
  tomorrowContainer: {
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 8,
    marginTop: 10,
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    bottom: -10,
    backgroundColor: '#C9579266',
    borderRadius: 50,
    width: '80%',
    height: 100,
    zIndex: -1,
  },
  tomorrowSplitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tomorrowLeftContainer: {
    position: 'relative',
    top: 14,
    flex: 1,
  },
  tomorrowLeftContainer_2: {
    flex: 1,
  },
  tomorrowRightContainer: {
    flex: 1,
  },
  tomorrowTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 15,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainWeather: {
    marginBottom: 10,
  },
  mainTemp: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
  },
  secondaryTemp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 40,
    fontWeight: 'bold',
  },
  weatherCondition: {
    marginLeft: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  weekContainer: {
    backgroundColor: theme === DARK_THEME ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    padding: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dayText: {
    color: theme === DARK_THEME ? "white" : "black",
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
  dayIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
  },
  dayIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  dayCondition: {
    color: theme === DARK_THEME ? "white" : "black",
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayHighTemp: {
    color: theme === DARK_THEME ? "white" : "black",
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayLowTemp: {
    color: theme === DARK_THEME ? "#fff9" : "#0006",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeatherDetailsScreen; 