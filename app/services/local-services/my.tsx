import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Моки для моих услуг
const myServices = [
  {
    id: '1',
    title: 'Сантехник',
    price: 1200,
    description: 'Устранение протечек, замена смесителей, установка сантехники',
    category: 'Сантехник',
    image: 'https://img.freepik.com/free-photo/plumbing-professional-doing-his-job_23-2150721533.jpg',
    author: { name: 'Павел', rating: 4.8 },
    views: 156,
    favorites: 12,
    contacts: 8,
    status: 'active'
  },
  {
    id: '2',
    title: 'Электрик',
    price: 1500,
    description: 'Проводка, розетки, светильники, устранение коротких замыканий',
    category: 'Электрик',
    image: 'https://s12.stc.yc.kpcdn.net/share/i/12/10559593/wr-960.webp',
    author: { name: 'Павел', rating: 4.8 },
    views: 234,
    favorites: 28,
    contacts: 15,
    status: 'active'
  }
];

export default function MyServicesScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои услуги</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {myServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => router.push(`/services/local-services/${service.id}`)}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: service.image }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price} ₽</Text>
                <Text style={styles.serviceCategory}>{service.category}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#00B894' }]}
        onPress={() => router.push('/services/local-services/new')}
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
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00B894',
    marginBottom: 8,
  },
  serviceCategory: {
    fontSize: 14,
    color: theme === 'dark' ? '#999' : '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#007AFF',
  },
}); 