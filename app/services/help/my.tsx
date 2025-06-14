import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Моки для моих заявок помощи
const myHelpRequests = [
  {
    id: '1',
    title: 'Нужна помощь с покупками',
    description: 'Пожилой человек, нужна помощь с покупкой продуктов на неделю.',
    image: 'https://media.istockphoto.com/id/1130450531/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C-%D0%B4%D0%B5%D0%B4%D1%83-%D1%81-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8.jpg?s=1024x1024&w=is&k=20&c=dGRjj3z78NQjpEjUaHESgC_73AG7I60Wk5knUDZcXQM=',
    price: '500 ₽',
    name: 'Анна Сергеевна',
    phone: '+7 (999) 111-22-33',
  }
];

export default function MyHelpScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои заявки</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {myHelpRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            onPress={() => router.push(`/services/help/${request.id}`)}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: request.image }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <Text style={styles.requestPrice}>{request.price}</Text>
                <Text style={styles.requestDescription}>{request.description}</Text>
                <View style={styles.authorContainer}>
                  <MaterialCommunityIcons name="account" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                  <Text style={styles.requestName}>{request.name}</Text>
                </View>
                <View style={styles.authorContainer}>
                  <MaterialCommunityIcons name="phone" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                  <Text style={styles.requestPhone}>{request.phone}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#FF6B6B' }]}
        onPress={() => router.push('/services/help/new')}
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
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
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
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  requestPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestName: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  requestPhone: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#007AFF',
  },
}); 