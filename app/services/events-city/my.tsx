import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Моки для моих событий
const myEvents = [
  {
    id: '1',
    title: 'Встреча соседей',
    description: 'Приглашаем всех на встречу во дворе для знакомства и общения!',
    image: 'https://pchela.news/storage/app/uploads/public/491/54f/fcc/thumb__770_490_0_0_crop.jpg',
    date: '2025-06-15',
    views: 156,
    participants: 12,
    contacts: 8,
    status: 'active'
  },
  {
    id: '2',
    title: 'Благотворительный забег',
    description: 'Участвуйте в забеге и помогите собрать средства на детскую площадку.',
    image: 'https://marathonec.ru/wp-content/uploads/2021/04/beg-vo-blago.jpg',
    date: '2025-06-20',
    views: 234,
    participants: 28,
    contacts: 15,
    status: 'active'
  }
];

export default function MyEventsScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои события</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {myEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => router.push(`/services/events-city/${event.id}`)}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: event.image }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('ru-RU')}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#4ECDC4' }]}
        onPress={() => router.push('/services/events-city/new')}
      />
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#007AFF',
  },
}); 