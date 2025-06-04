import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';

const demoEvents = [
  {
    id: '1',
    title: 'Открытие нового парка',
    description: 'В эту субботу состоится открытие нового парка в центре города. Приглашаем всех!',
    image: 'https://static.tildacdn.com/tild3163-3437-4265-a261-353166373462/5353058457198124841.jpg',
    date: '2024-06-10',
  },
  {
    id: '2',
    title: 'Отключение воды',
    description: 'Внимание! 12 июня с 9:00 до 18:00 будет отключена вода в связи с ремонтными работами.',
    image: 'https://f78e1a6a-ca4c-458a-b3f0-9f53a2bad2a5.selstorage.ru/2025-04-22/MADa2UbcSajCxPqT.png',
    date: '2024-06-12',
  },
];

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const event = demoEvents.find(e => e.id === id) || demoEvents[0];
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/services/events/events')} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.date}>{new Date(event.date).toLocaleDateString('ru-RU')}</Text>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#111' : '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 0,
  },
  content: {
    padding: 20,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -24,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    borderRadius: 16,
    elevation: 2,
  },
  date: {
    fontSize: 15,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginLeft: 4,
    flex: 1,
    textAlign: 'right',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#222',
    textAlign: 'left',
    lineHeight: 22,
  },
}); 