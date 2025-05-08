import { Stack } from "expo-router";
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BellRing, Blocks, MapPin, House, User } from 'lucide-react-native';
import { DARK_THEME, useThemeName } from "@/core/hooks/useTheme";

export default function TabsLayout() {
  const theme = useThemeName();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === DARK_THEME ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: theme === DARK_THEME ? '#aaa' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: theme === DARK_THEME ? '#222' : '#FFFFFF',
          borderTopWidth: 1,
          borderColor: theme === DARK_THEME ? '#333' : '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: theme === DARK_THEME ? '#333' : '#FFFFFF',
        },
        headerTitleStyle: {
          color: theme === DARK_THEME ? '#fff' : '#000000',
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Главная',
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          headerShown: false,
          title: 'Сервисы',
          tabBarIcon: ({ color, size }) => (
            <Blocks size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          headerShown: false,
          title: 'Рядом',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          title: 'Уведомления',
          tabBarIcon: ({ color, size }) => (
            <BellRing size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
