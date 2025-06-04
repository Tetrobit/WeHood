import { Stack } from "expo-router";
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BellRing, Blocks, MapPin, House, User } from 'lucide-react-native';
import { useTheme } from "@/core/hooks/useTheme";

export default function TabsLayout() {
  const [theme] = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: theme === 'dark' ? '#aaa' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#222' : '#FFFFFF',
          borderTopWidth: 1,
          borderColor: theme === 'dark' ? '#333' : '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#FFFFFF',
        },
        headerTitleStyle: {
          color: theme === 'dark' ? '#fff' : '#000000',
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
