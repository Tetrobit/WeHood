import { Stack } from "expo-router";
import { useThemeName } from "@/core/hooks/useTheme";
import { DARK_THEME } from "@/core/hooks/useTheme";
import StorageProvider from "@/core/models";
import React from "react";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});


export default function RootLayoutWrapper() {
  return (
    <StorageProvider>
      <RootLayout />
    </StorageProvider>
  )
}

function RootLayout() {
  const themeName = useThemeName();

  const themedStatusBarStyle = themeName === DARK_THEME ? 'light' : 'dark';
  const themedStatusBarBackgroundColor = themeName === DARK_THEME ? '#000000' : '#ffffff';

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="auth" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="(tabs)" options={{
        headerShown: false,
        statusBarStyle: themedStatusBarStyle,
        statusBarBackgroundColor: themedStatusBarBackgroundColor
      }} />
      <Stack.Screen name="weather"
        options={{
          headerShown: false,
          statusBarStyle: themedStatusBarStyle,
          statusBarBackgroundColor: themedStatusBarBackgroundColor
        }}
      />
      <Stack.Screen name="weather-details"
        options={{
          headerShown: false,
          statusBarStyle: themedStatusBarStyle,
          statusBarBackgroundColor: themedStatusBarBackgroundColor
        }}
      />
    </Stack>
  );
}
