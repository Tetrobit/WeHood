import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme, useThemeName, useSetTheme, THEMES } from '@/core/hooks/useTheme';
import { useGeolocation } from '@/core/hooks/useGeolocation';
import { router } from 'expo-router';
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import { openSettings } from 'react-native-permissions';
import LottieView from 'lottie-react-native';
import { wait } from '@/core/utils/time';
import { useSharedValue } from 'react-native-reanimated';
import { useQuery, useRealm } from '@realm/react';
import Theme from '@/core/models/theme';
import { useColorScheme } from 'react-native';

export const Greeting = () => {
  const systemTheme = useColorScheme();
  const pagerRef = useRef<PagerView>(null);
  const themeName = useThemeName();
  const setThemeName = useSetTheme();
  const { requestGeolocation } = useGeolocation();
  const animationRef = useRef<LottieView>(null);
  const isSwitched = useSharedValue(true);
  const [isThemeSwitched, setIsThemeSwitched] = useState(true);
  const [realmTheme] = useQuery(Theme)
  const realm = useRealm();

  const handleNext = (page: number) => {
    pagerRef.current?.setPage(page);
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  const handleThemeChange = async (theme: typeof THEMES[number]) => {
    if (!isSwitched.value) return;
    setIsThemeSwitched(false);
    isSwitched.value = false;
    setThemeName(theme);
    setStatusBarBackgroundColor(theme === 'light' ? '#ffffff' : '#000000');
    if (theme === 'dark') {
      animationRef.current!.setState({ direction: 1 });
      animationRef.current?.play(60, 100);
      await wait(800);
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
      if (realmTheme) {
        realm.write(() => {
          realmTheme.name = systemTheme === 'dark' ? 'dark' : 'light';
        });
      }

      if (systemTheme === 'dark') {
        animationRef.current?.play(100, 100);
      }
      else {
        animationRef.current?.play(1, 1);
      }
      await wait(20);
      // animationRef.current?.pause();
    }
    init();
  }, []);

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
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
      color: theme.textColor,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: theme.textColor + '99',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
      color: theme.textColor + '99',
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
      backgroundColor: theme.backgroundColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
      width: '45%',
      alignItems: 'center',
    },
    activeTheme: {
      backgroundColor: themeName == 'light' ? '#000000' : '#ffffff',
      borderColor: themeName == 'light' ? '#000000' : '#ffffff',
      color: themeName == 'light' ? '#ffffff' : '#000000',
    },
    themeButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textColor,
    },
    geoButton: {
      backgroundColor: theme.buttonColor,
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    geoButtonText: {
      color: theme.buttonTextColor,
      fontSize: 16,
      fontWeight: '500',
    },
    nextButton: {
      backgroundColor: theme.buttonColor,
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    nextButtonText: {
      color: theme.buttonTextColor,
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
      color: theme.buttonTextColor,
      fontSize: 16,
      fontWeight: '500',
    },
  });

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
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleThemeChange(themeName === 'light' ? 'dark' : 'light')}>
              <LottieView 
                ref={animationRef}
                autoPlay={false}
                source={require('@/assets/lottie/theme.json')}
                style={{ width: 300, height: 200 }}
              />
            </TouchableOpacity>
            <Text style={styles.description}>
              {themeName === 'light' 
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

export default Greeting;