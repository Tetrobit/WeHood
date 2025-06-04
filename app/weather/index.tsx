import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, LayoutAnimation, UIManager, Dimensions, ScrollView, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WeatherRain from '@/app/components/WeatherRain';
import { DARK_THEME, LIGHT_THEME, ThemeName } from '@/core/hooks/useTheme';
import { useSetTheme, useThemeName } from '@/core/hooks/useTheme';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import useGeolocation from '@/core/hooks/useGeolocation';
import useWeather from '@/core/hooks/useWeather';
import { getWeatherCondition, getWeatherIcon } from '@/core/utils/weather';

const screenHeight = Dimensions.get('window').height;

interface WeatherMetric {
  value: string | number;
  label: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  icon: React.ReactNode;
}

const WeatherScreen: React.FC = () => {
  const themeName = useThemeName();
  const { lastLocation } = useGeolocation();
  const { lastWeatherForecast, lastWeatherForecastRecord } = useWeather();
  const metrics: WeatherMetric[] = [
    { value: `${lastWeatherForecast?.list?.[0]?.wind?.speed} км/ч`, label: 'Ветер' },
    { value: `${lastWeatherForecast?.list?.[0]?.main?.humidity}%`, label: 'Влажность' },
    { value: `${lastWeatherForecast?.list?.[0]?.pop * 100}%`, label: 'Осадки' },
  ];

  const hourlyForecast: HourlyForecast[] = lastWeatherForecast?.list?.slice(0, 4).map((item) => ({
    time: new Date(item.dt_txt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    temperature: Math.round(item.main.temp - 273.15),
    icon: getWeatherIcon(item.weather[0].main, themeName === DARK_THEME ? 'white' : 'black', 24),
  }));

  const onBack = () => {
    router.back();
  }

  const styles = React.useMemo(() => makeStyles(themeName!), [themeName]);

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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <LinearGradient
        colors={['#7C4585', '#C95792']}
        style={styles.container}
      >
        <View style={styles.view}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="grid-outline" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={18} color="white" />
              <Text style={styles.cityText}>{lastLocation?.district ?? lastLocation?.locality}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Updating Status */}
          <View style={styles.updatingContainer}>
            <View style={styles.updatingPill}>
              <Text style={styles.updatingText}>• Обновлено в {new Date(lastWeatherForecastRecord?.timestamp.getTime()).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>

          {/* Main Weather Icon */}
          <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}>
            <View style={styles.weatherIconContainer}>
              { getWeatherIcon(lastWeatherForecast?.list?.[0]?.weather[0]?.main, 'white', 120) }
            </View>
          </Animated.View>


          {/* Temperature and Condition */}
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{Math.round(lastWeatherForecast?.list?.[0]?.main?.temp - 273.15)}°</Text>
            <Text style={styles.condition}>{getWeatherCondition(lastWeatherForecast?.list?.[0]?.weather[0]?.main)}</Text>
            <Text style={styles.date}>{new Date(lastWeatherForecast?.list?.[0]?.dt * 1000).toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
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
        </View>
        <View style={styles.shadow}></View>
      </LinearGradient>

      {/* Hourly Forecast */}
      <View style={styles.forecastContainer}>
        <View style={styles.forecastHeader}>
          <Text style={styles.forecastTitle}>Сегодня</Text>
          <TouchableOpacity 
            style={styles.daysButton}
            onPress={() => router.push('/weather/forecast')}
          >
            <Text style={styles.daysButtonText}>7 дней</Text>
            <Ionicons name="chevron-forward" size={20} color={themeName === DARK_THEME ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.hourlyContainer}>
          {hourlyForecast.map((hour, index) => (
            <View 
              key={index} 
              style={[
                styles.hourlyItem,
                index === 0 && styles.activeHourly
              ]}
            >
              <Text style={styles.hourlyTime}>{hour.time}</Text>
              <Text style={styles.hourlyIcon}>{hour.icon}</Text>
              <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeName) => StyleSheet.create({
  container: {
    borderRadius: 50,
    margin: 7,
    padding: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  scrollViewContainer: { 
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
  safeArea: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000000' : '#ffffff',
  },
  view: {
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
  },
  updatingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  updatingPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  updatingText: {
    color: 'white',
    fontSize: 12,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainWeatherIcon: {
    width: 200,
    height: 200,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  temperature: {
    color: 'white',
    fontSize: 90,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  condition: {
    color: 'white',
    fontSize: 24,
    marginTop: 5,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20, // Добавлено
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
  forecastContainer: {
    width: '100%',
    left: 0,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastTitle: {
    color: theme === DARK_THEME ? 'white' : 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  daysButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysButtonText: {
    color: theme === DARK_THEME ? 'white' : 'black',
    fontSize: 16,
    marginRight: 5,
  },
  hourlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  hourlyItem: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: theme === DARK_THEME ? '#7777' : '#7771',
    padding: 15,
    width: '23%',
  },
  activeHourly: {
    backgroundColor: theme === DARK_THEME ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
  },
  hourlyTime: {
    color: theme === DARK_THEME ? 'white' : 'black',
    fontSize: 14,
  },
  hourlyIcon: {
    fontSize: 24,
    marginVertical: 8,
  },
  hourlyTemp: {
    color: theme === DARK_THEME ? 'white' : 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WeatherScreen;
