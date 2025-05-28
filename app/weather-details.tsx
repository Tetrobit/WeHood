import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DARK_THEME, ThemeName, useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import { Scroll } from 'lucide-react-native';

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
  const theme = useThemeName();

  const metrics: WeatherMetric[] = [
    { value: '9 км/ч', label: 'Ветер' },
    { value: '31%', label: 'Влажность' },
    { value: '93%', label: 'Осадки' },
  ];

  const weekForecast: DayForecast[] = [
    { day: 'Пн', condition: 'Дождь', highTemp: 20, lowTemp: 14, icon: '🌧️' },
    { day: 'Вт', condition: 'Дождь', highTemp: 22, lowTemp: 16, icon: '🌧️' },
    { day: 'Ср', condition: 'Шторм', highTemp: 19, lowTemp: 13, icon: '⛈️' },
    { day: 'Чт', condition: 'Облачно', highTemp: 18, lowTemp: 12, icon: '☁️' },
    { day: 'Пт', condition: 'Гроза', highTemp: 23, lowTemp: 19, icon: '⚡' },
    { day: 'Сб', condition: 'Дождь', highTemp: 25, lowTemp: 17, icon: '🌧️' },
    { day: 'Вс', condition: 'Шторм', highTemp: 21, lowTemp: 18, icon: '⛈️' },
  ];
  
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

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
          <View style={styles.tomorrowLeftContainer_2}>
            <Ionicons name="cloud" size={120} color="white" />
          </View>
          <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}>
            <View style={styles.tomorrowLeftContainer}>
              <Ionicons name="cloud" size={120} color="white" />
            </View>
          </Animated.View>

            <View style={styles.tomorrowRightContainer}>
              <View style={styles.mainWeather}>
                <Text style={styles.tomorrowTitle}>Завтра</Text>
                <View style={styles.temperatureContainer}>
                <Text style={styles.mainTemp}>20</Text>
                <Text style={styles.secondaryTemp}>/17°</Text>
              </View>
              <Text style={styles.weatherCondition}>Дождь - Облачно</Text>
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
            <Text style={styles.dayText}>{day.day}</Text>
            <View style={styles.dayIconContainer}>
              <Text style={styles.dayIcon}>{day.icon}</Text>
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
    left: -118,
    top: 14,
    flex: 1,
  },
  tomorrowLeftContainer_2: {
    flex: 1,
  },
  tomorrowRightContainer: {
    position: 'relative',
    left: -100,
    flex: 1,
  },
  tomorrowTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
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