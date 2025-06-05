import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { useGeolocation } from '@/core/hooks/useGeolocation';
import { router } from 'expo-router';
import { setStatusBarBackgroundColor, setStatusBarStyle } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { wait } from '@/core/utils/time';
import { useSharedValue } from 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import * as SecureStorage from 'expo-secure-store';

export const GreetingScreen = () => {
  const systemTheme = useColorScheme();
  const pagerRef = useRef<PagerView>(null);
  const [theme, setTheme] = useTheme();
  const { location, requestGeolocation, errorMsg } = useGeolocation();
  const animationRef = useRef<LottieView>(null);
  const isSwitched = useSharedValue(true);
  const [isThemeSwitched, setIsThemeSwitched] = useState(true);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);

  const handleNext = (page: number) => {
    pagerRef.current?.setPage(page);
  };

  const handleFinish = () => {
    SecureStorage.setItem('passed_greeting', 'true');
    router.replace('/(tabs)');
  };

  const handleThemeChange = async (theme: Theme) => {
    if (!isSwitched.value) return;
    setIsThemeSwitched(false);
    isSwitched.value = false;
    setTheme(theme as Theme);

    setStatusBarBackgroundColor(theme === 'light' ? '#ffffff' : '#000000');
    setStatusBarStyle(theme === 'light' ? 'dark' : 'light');

    if (theme === 'dark') {
      animationRef.current!.setState({ direction: 1 });
      animationRef.current?.play(60, 100);
      await wait(1000);
      animationRef.current?.pause();
    }
    else {
      animationRef.current!.play(80, 40);
      await wait(800);
      animationRef.current?.pause();
    }

    isSwitched.value = true;
    setIsThemeSwitched(true);
  };

  React.useEffect(() => { 
    async function init() {
      setStatusBarBackgroundColor(systemTheme === 'dark' ? '#000000' : '#ffffff');
      setStatusBarStyle(systemTheme === 'dark' ? 'light' : 'dark');

      if (systemTheme === 'dark') {
        animationRef.current?.play(100, 100);
      }
      else {
        animationRef.current?.play(1, 1);
      }
      await wait(20);
    }
    init();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
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
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    themeButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 30,
    },
    themeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
    },
    themeButton: {
      padding: 15,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#000000' : '#000000',
      width: '45%',
      alignItems: 'center',
    },
    activeTheme: {
      backgroundColor: theme === 'light' ? '#000000' : '#ffffff',
      borderColor: theme === 'light' ? '#000000' : '#ffffff',
      color: theme === 'light' ? '#ffffff' : '#000000',
    },
    themeButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    geoButton: {
      backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    geoButtonText: {
      color: theme === 'dark' ? '#000000' : '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    },
    nextButton: {
      backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    nextButtonText: {
      color: theme === 'dark' ? '#000000' : '#ffffff',
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
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
  });

  const handleGeolocation = async () => {
    setIsGeolocationLoading(true);
    try {
      const result = await requestGeolocation();
      if (result) {
        Toast.success('Геолокация успешно получена');
      }
      else {
        throw new Error('Произошла ошибка при получении геолокации');
      }
    }
    catch (error) {
      Toast.error('Произошла ошибка при получении геолокации');
    }
    finally {
      setIsGeolocationLoading(false);
    }
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
          <View style={styles.themeContainer}>
            <Text style={styles.title}>Давайте настроим приложение</Text>
            <Text style={styles.subtitle}>Выберите тему</Text>
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}>
              <LottieView 
                ref={animationRef}
                autoPlay={false}
                source={require('@/assets/lottie/theme.json')}
                style={{ width: 300, height: 200 }}
              />
            </TouchableOpacity>
            <Text style={styles.description}>
              {theme === 'light' 
                ? 'Мы выбрали светлую тему, так как она была выбрана в настройках вашего устройства'
                : 'Мы выбрали тёмную тему, так как она была выбрана в настройках вашего устройства'}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(1)}>
              <Text style={styles.nextButtonText}>Далее</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Страница геолокации */}
        <View key="2" style={styles.page}>
          <LottieView
            source={require('@/assets/lottie/geolocation.json')}
            style={{ width: 400, height: 300 }}
            loop={true}
            autoPlay={true}
          />
          <Text style={styles.title}>Геолокация</Text>
          <Text style={styles.description}>
            Для корректной работы приложения нам нужен доступ к вашей геолокации
          </Text>
          {!location && (
            <TouchableOpacity 
              style={styles.geoButton} 
              onPress={handleGeolocation}
            >
              {isGeolocationLoading ? (
                <ActivityIndicator size="small" color={theme === 'dark' ? '#000000' : '#ffffff'} />
              ) : (
                <Text style={styles.geoButtonText}>Разрешить доступ</Text>
              )}
            </TouchableOpacity>
          )}
          { !location && errorMsg && (
            <TouchableOpacity style={styles.nextButton} onPress={() => Linking.openSettings()}>
              <Text style={styles.nextButtonText}>Открыть настройки</Text>
            </TouchableOpacity>
          )}
          { location && (
            <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(2)}>
              <Text style={styles.nextButtonText}>Далее</Text>
            </TouchableOpacity>
          )}
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
      <ToastManager />
    </View>
  );
};

export default GreetingScreen;