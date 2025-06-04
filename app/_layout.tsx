import { Stack } from "expo-router";
import StorageProvider from "@/core/models";
import React from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import ToastManager from 'toastify-react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useTheme } from "@/core/hooks/useTheme";
import { ThemeProvider } from "@/core/hooks/useTheme";

function RootLayout() {
  const [theme] = useTheme();

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