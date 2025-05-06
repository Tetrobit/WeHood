import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface WeatherMetric {
  value: string | number;
  label: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
}

const WeatherScreen: React.FC = () => {
  const metrics: WeatherMetric[] = [
    { value: '13 km/h', label: 'Wind' },
    { value: '24%', label: 'Humidity' },
    { value: '87%', label: 'Chance of rain' },
  ];

  const hourlyForecast: HourlyForecast[] = [
    { time: '6:00', temperature: 23, icon: '🌥️' },
    { time: '12:00', temperature: 21, icon: '⛈️' },
    { time: '18:00', temperature: 22, icon: '🌥️' },
    { time: '23:59', temperature: 19, icon: '🌤️' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#7C4585', '#C95792']}
        style={styles.container}
      >
        <View style={styles.view}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="grid-outline" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={18} color="white" />
              <Text style={styles.cityText}>Minsk</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Updating Status */}
          <View style={styles.updatingContainer}>
            <View style={styles.updatingPill}>
              <Text style={styles.updatingText}>• Updating</Text>
            </View>
          </View>

          {/* Main Weather Icon */}
          <View style={styles.weatherIconContainer}>
            {/* <Image 
              source={require('../assets/weather-icons/thunderstorm.png')}
              style={styles.mainWeatherIcon}
            /> */}
          </View>

          {/* Temperature and Condition */}
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>21°</Text>
            <Text style={styles.condition}>Thunderstorm</Text>
            <Text style={styles.date}>Monday, 17 May</Text>
          </View>

          {/* Weather Metrics */}
          <View style={styles.metricsContainer}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricItem}>
                <Ionicons 
                  name={index === 0 ? 'speedometer-outline' : index === 1 ? 'water-outline' : 'rainy-outline'} 
                  size={20} 
                  color="white" 
                />
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
          <Text style={styles.forecastTitle}>Today</Text>
          <TouchableOpacity 
            style={styles.daysButton}
            onPress={() => router.push('/weather-details')}
          >
            <Text style={styles.daysButtonText}>7 days</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.hourlyContainer}>
          {hourlyForecast.map((hour, index) => (
            <View 
              key={index} 
              style={[
                styles.hourlyItem,
                index === 1 && styles.activeHourly
              ]}
            >
              <Text style={styles.hourlyTime}>{hour.time}</Text>
              <Text style={styles.hourlyIcon}>{hour.icon}</Text>
              <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    margin: 7,
    padding: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    bottom: -10,
    backgroundColor: '#C9579244',
    borderRadius: 50,
    width: '80%',
    height: 100,
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  view: {
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginTop: 30,
  },
  mainWeatherIcon: {
    width: 200,
    height: 200,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  temperature: {
    color: 'white',
    fontSize: 72,
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
    marginTop: 30,
    paddingHorizontal: 20,
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
    marginTop: 40,
    paddingHorizontal: 20,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  daysButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysButtonText: {
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 15,
    width: '23%',
  },
  activeHourly: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  hourlyTime: {
    color: 'white',
    fontSize: 14,
  },
  hourlyIcon: {
    fontSize: 24,
    marginVertical: 8,
  },
  hourlyTemp: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WeatherScreen;
