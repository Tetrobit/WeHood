import { Stack } from "expo-router";
import { useTheme, Theme } from "@/core/hooks/useTheme";
import StorageProvider from "@/core/models";
import React from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export default function ServicesLayout() {
  const [theme] = useTheme();

  const themedStatusBarStyle = theme === 'dark' ? 'light' : 'dark';
  const themedStatusBarBackgroundColor = theme === 'dark' ? '#000000' : '#ffffff';

  const defaultConfig: NativeStackNavigationOptions = {
    statusBarStyle: themedStatusBarStyle,
    statusBarBackgroundColor: themedStatusBarBackgroundColor,
    headerShown: false,
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flats/index" options={{...defaultConfig}} />
      <Stack.Screen name="flats/[id]" options={defaultConfig} />
      <Stack.Screen name="flats/new" options={{...defaultConfig, title: 'Новое объявление'}} />
      <Stack.Screen name="flats/viewed" options={{...defaultConfig, title: 'Просмотренные'}} />
      <Stack.Screen name="flats/favorites" options={{...defaultConfig, title: 'Избранное'}} />
      <Stack.Screen name="flats/my" options={{...defaultConfig, title: 'Мои объявления'}} />
      <Stack.Screen name="events" options={{...defaultConfig, title: 'События'}} />
      <Stack.Screen name="activities/index" options={{...defaultConfig, title: 'Детские секции'}} />
      <Stack.Screen name="activities/apply" options={{...defaultConfig, title: 'Подать заявку'}} />
      <Stack.Screen name="activities/my" options={{...defaultConfig, title: 'Мои заявки'}} />
      <Stack.Screen name="activities/contact" options={{...defaultConfig, title: 'Связаться'}} />
      <Stack.Screen name="marketplace/index" options={{...defaultConfig, title: 'Товары и услуги'}} />
      <Stack.Screen name="marketplace/[id]" options={defaultConfig} />
      <Stack.Screen name="flea-market/index" options={{...defaultConfig, title: 'Барахолка'}} />
      <Stack.Screen name="flea-market/[id]" options={defaultConfig} />
      <Stack.Screen name="flea-market/new" options={{...defaultConfig, title: 'Новое объявление'}} />
      <Stack.Screen name="local-services/index" options={{...defaultConfig, title: 'Местные службы'}} />
      <Stack.Screen name="local-services/[id]" options={defaultConfig} />
      <Stack.Screen name="local-services/new" options={{...defaultConfig, title: 'Добавить услугу'}} />
      <Stack.Screen name="nearby/view" options={{...defaultConfig, statusBarBackgroundColor: 'black', statusBarStyle: 'light'}} />
      <Stack.Screen name="nearby/add" options={{...defaultConfig, title: 'Опубликовать пост'}} />
      <Stack.Screen name="profile/[id]" options={{...defaultConfig, title: 'Профиль'}} />
      <Stack.Screen name="neighbors/chats" options={{...defaultConfig, title: 'Чаты соседей'}} />
      <Stack.Screen name="neighbors/chat/[id]" options={{...defaultConfig, title: 'Чат'}} />
    </Stack>
  );
}
