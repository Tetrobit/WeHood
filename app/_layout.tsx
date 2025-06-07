import { Stack } from "expo-router";
import StorageProvider from "@/core/models";
import React, { useEffect } from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import ToastManager from 'toastify-react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useTheme } from "@/core/hooks/useTheme";
import { ThemeProvider } from "@/core/hooks/useTheme";
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

function RootLayout() {
  const [theme] = useTheme();

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Запрашиваем разрешение на уведомления
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          // Настраиваем обработчик уведомлений
          messaging().onMessage(async remoteMessage => {
            // Показываем уведомление, когда приложение открыто
            await Notifications.scheduleNotificationAsync({
              content: {
                title: remoteMessage.notification?.title || 'Новое уведомление',
                body: remoteMessage.notification?.body,
                data: remoteMessage.data,
              },
              trigger: null,
            });
          });

          // Обработка уведомлений, когда приложение в фоне
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
          });
        }
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };

    initializeFirebase();
  }, []);

  const themedStatusBarStyle = theme === 'dark' ? 'light' : 'dark';
  const themedStatusBarBackgroundColor = theme === 'dark' ? '#000000' : '#ffffff';

  const defaultConfig: NativeStackNavigationOptions = {
    statusBarStyle: themedStatusBarStyle,
    statusBarBackgroundColor: themedStatusBarBackgroundColor,
    headerShown: false,
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light' }} />
      <Stack.Screen name="auth/index" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="(tabs)" options={defaultConfig} />
      <Stack.Screen name="weather/index" options={defaultConfig} />
      <Stack.Screen name="weather/forecast" options={defaultConfig} />
      <Stack.Screen name="+not-found" options={defaultConfig} />
      <Stack.Screen name="services" options={defaultConfig} />
      <Stack.Screen name="greeting/index" options={defaultConfig} />
      <Stack.Screen name="news/[id]" options={defaultConfig} />
      <Stack.Screen name="stories" options={defaultConfig} />
    </Stack>
  );
}

export default function RootLayoutWrapper() {
  return (
    <ThemeProvider>
      <StorageProvider>
        <PaperProvider>
          <RootLayout />
          <ToastManager />
        </PaperProvider>
      </StorageProvider>
    </ThemeProvider>
  )
}