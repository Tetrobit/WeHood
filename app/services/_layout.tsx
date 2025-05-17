import { Stack } from "expo-router";
import { useThemeName } from "@/core/hooks/useTheme";
import { DARK_THEME } from "@/core/hooks/useTheme";
import StorageProvider from "@/core/models";
import React from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export default function ServicesLayout() {
  const themeName = useThemeName();

  const themedStatusBarStyle = themeName === DARK_THEME ? 'light' : 'dark';
  const themedStatusBarBackgroundColor = themeName === DARK_THEME ? '#000000' : '#ffffff';

  const defaultConfig: NativeStackNavigationOptions = {
    statusBarStyle: themedStatusBarStyle,
    statusBarBackgroundColor: themedStatusBarBackgroundColor,
    headerShown: false,
  };

  return (
    <Stack>
      <Stack.Screen name="flats/index" options={{...defaultConfig}} />
      <Stack.Screen name="flats/[id]" options={defaultConfig} />
      <Stack.Screen name="flats/new" options={{...defaultConfig, title: 'Новое объявление'}} />
      <Stack.Screen name="flats/viewed" options={{...defaultConfig, title: 'Просмотренные'}} />
      <Stack.Screen name="flats/favorites" options={{...defaultConfig, title: 'Избранное'}} />
      <Stack.Screen name="flats/my" options={{...defaultConfig, title: 'Мои объявления'}} />
      <Stack.Screen name="events" options={{...defaultConfig, title: 'События'}} />
    </Stack>
  );
}
