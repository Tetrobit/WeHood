import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface WeatherMetric {
  value: string;
  label: string;
}

interface DayForecast {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
}

const WeatherDetailsScreen: React.FC = () => {
  const metrics: WeatherMetric[] = [
    { value: '9 km/h', label: 'Wind' },
    { value: '31%', label: 'Humidity' },
    { value: '93%', label: 'Chance of rain' },
  ];

  const weekForecast: DayForecast[] = [
    { day: 'Mon', condition: 'Rainy', highTemp: 20, lowTemp: 14, icon: '🌧️' },
    { day: 'Tue', condition: 'Rainy', highTemp: 22, lowTemp: 16, icon: '🌧️' },
    { day: 'Wed', condition: 'Storm', highTemp: 19, lowTemp: 13, icon: '⛈️' },
    { day: 'Thu', condition: 'Slow', highTemp: 18, lowTemp: 12, icon: '☁️' },
    { day: 'Fri', condition: 'Thunder', highTemp: 23, lowTemp: 19, icon: '⚡' },
    { day: 'Sat', condition: 'Rainy', highTemp: 25, lowTemp: 17, icon: '🌧️' },
    { day: 'Sun', condition: 'Storm', highTemp: 21, lowTemp: 18, icon: '⛈️' },
  ];

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="tv-outline" size={18} color="white" />
            <Text style={styles.headerText}>7 days</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tomorrow's Forecast */}
        <View style={styles.tomorrowContainer}>
          <Text style={styles.tomorrowTitle}>Tomorrow</Text>
          <View style={styles.mainWeather}>
            <View style={styles.temperatureContainer}>
              <Text style={styles.mainTemp}>20</Text>
              <Text style={styles.secondaryTemp}>/17°</Text>
            </View>
            <Text style={styles.weatherCondition}>Rainy - Cloudy</Text>
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

        {/* Weekly Forecast */}
        <View style={styles.weekContainer}>
          {weekForecast.map((day, index) => (
            <View key={index} style={styles.dayRow}>
              <Text style={styles.dayText}>{day.day}</Text>
              <View style={styles.dayIconContainer}>
                <Text style={styles.dayIcon}>{day.icon}</Text>
                <Text style={styles.dayCondition}>{day.condition}</Text>
              </View>
              <Text style={styles.dayTemp}>+{day.highTemp}° +{day.lowTemp}°</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tomorrowContainer: {
    padding: 20,
  },
  tomorrowTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  mainWeather: {
    marginBottom: 30,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainTemp: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
  },
  secondaryTemp: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 32,
    marginLeft: 5,
  },
  weatherCondition: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    padding: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayText: {
    color: 'white',
    fontSize: 16,
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
    color: 'white',
    fontSize: 16,
  },
  dayTemp: {
    color: 'white',
    fontSize: 16,
  },
});

export default WeatherDetailsScreen; 