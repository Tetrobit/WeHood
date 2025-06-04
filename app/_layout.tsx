import { Stack } from "expo-router";
import { useThemeName } from "@/core/hooks/useTheme";
import { DARK_THEME } from "@/core/hooks/useTheme";
import StorageProvider from "@/core/models";
import React from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import ToastManager from 'toastify-react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Image } from 'react-native';
import { useQuery } from '@realm/react';
import Profile from '@/core/models/profile';

function RootLayout() {
  const themeName = useThemeName();

  const themedStatusBarStyle = themeName === DARK_THEME ? 'light' : 'dark';
  const themedStatusBarBackgroundColor = themeName === DARK_THEME ? '#000000' : '#ffffff';

  const defaultConfig: NativeStackNavigationOptions = {
    statusBarStyle: themedStatusBarStyle,
    statusBarBackgroundColor: themedStatusBarBackgroundColor,
    headerShown: false,
  };

  const mockAvatars = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg',
  ];
  const defaultAvatar = 'https://randomuser.me/api/portraits/lego/1.jpg';

  const [profile] = useQuery(Profile);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light' }} />
      <Stack.Screen name="auth/index" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="auth/vk" options={{ headerShown: false, statusBarStyle: 'light' }} />
      <Stack.Screen name="(tabs)" options={defaultConfig} />
      <Stack.Screen name="weather" options={defaultConfig} />
      <Stack.Screen name="weather-details" options={defaultConfig} />
      <Stack.Screen name="+not-found" options={defaultConfig} />
      <Stack.Screen name="services" options={defaultConfig} />
      <Stack.Screen name="greeting/index" options={defaultConfig} />
      <Stack.Screen name="add-content" options={defaultConfig} />
      <Stack.Screen name="news" options={{headerShown: false}} />
      <Stack.Screen name="news/[id]" options={{headerShown: false}} />
    </Stack>
  );
}

export default function RootLayoutWrapper() {
  return (
    <StorageProvider>
      <PaperProvider>
        <RootLayout />
        <ToastManager />
      </PaperProvider>
    </StorageProvider>
  )
}