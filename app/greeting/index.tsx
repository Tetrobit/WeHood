import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme, useThemeName, useSetTheme } from '@/core/hooks/useTheme';
import { useGeolocation } from '@/core/hooks/useGeolocation';
import { router } from 'expo-router';

export const Greeting = () => {
  const pagerRef = useRef<PagerView>(null);
  const themeName = useThemeName();
  const setThemeName = useSetTheme();

  const { requestGeolocation } = useGeolocation();

  const handleNext = (page: number) => {
    pagerRef.current?.setPage(page);
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        scrollEnabled={false}
      >
        {/* Страница выбора темы */}
        <View key="1" style={styles.page}>
          <Text style={styles.title}>Выберите тему</Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity 
              style={[styles.themeButton, themeName === 'light' && styles.activeTheme]} 
              onPress={() => setThemeName('light')}
            >
              <Text style={styles.themeButtonText}>Светлая</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeButton, themeName === 'dark' && styles.activeTheme]} 
              onPress={() => setThemeName('dark')}
            >
              <Text style={styles.themeButtonText}>Тёмная</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(1)}>
            <Text style={styles.nextButtonText}>Далее</Text>
          </TouchableOpacity>
        </View>

        {/* Страница геолокации */}
        <View key="2" style={styles.page}>
          <Text style={styles.title}>Геолокация</Text>
          <Text style={styles.description}>
            Для корректной работы приложения нам нужен доступ к вашей геолокации
          </Text>
          <TouchableOpacity 
            style={styles.geoButton} 
            onPress={requestGeolocation}
          >
            <Text style={styles.geoButtonText}>Разрешить доступ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(2)}>
            <Text style={styles.nextButtonText}>Далее</Text>
          </TouchableOpacity>
        </View>

        {/* Финальная страница */}
        <View key="3" style={styles.page}>
          <Text style={styles.title}>Всё готово!</Text>
          <Text style={styles.description}>
            Теперь вы можете начать использовать приложение
          </Text>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Начать</Text>
          </TouchableOpacity>
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  themeButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    width: '45%',
    alignItems: 'center',
  },
  activeTheme: {
    backgroundColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  geoButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  geoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  finishButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Greeting;