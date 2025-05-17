import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import FlatCard from '@/app/components/FlatCard';
import { IFlat } from '@/app/types/flat';

// Моковые данные избранных квартир
const mockFavoriteFlats: IFlat[] = [
  {
    id: '3',
    title: '3-комнатная квартира с террасой',
    description: 'Просторная квартира с дизайнерским ремонтом и террасой',
    price: 45000,
    address: 'ул. Гагарина, д. 25',
    distance: 1500,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    rooms: 3,
    area: 85,
    floor: 8,
    totalFloors: 10,
    views: 156,
    currentViewers: 5,
    createdAt: new Date().toISOString(),
    landlord: {
      id: '3',
      name: 'Елена',
      phone: '+7 (999) 345-67-89',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  },
  {
    id: '4',
    title: 'Уютная квартира-студия',
    description: 'Современная студия с новой мебелью',
    price: 25000,
    address: 'ул. Советская, д. 12',
    distance: 600,
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6'],
    rooms: 1,
    area: 28,
    floor: 3,
    totalFloors: 5,
    views: 89,
    currentViewers: 1,
    createdAt: new Date().toISOString(),
    landlord: {
      id: '4',
      name: 'Дмитрий',
      phone: '+7 (999) 456-78-90',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  },
];

export default function FavoritesScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={theme === DARK_THEME ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={styles.title}>Избранное</Text>
        <View style={{ width: 24 }} />
      </View>

      {mockFavoriteFlats.length > 0 ? (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {mockFavoriteFlats.map(flat => (
            <FlatCard key={flat.id} flat={flat} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="heart-outline" 
            size={64} 
            color={theme === DARK_THEME ? '#666' : '#999'} 
          />
          <Text style={styles.emptyStateText}>
            У вас пока нет избранных квартир
          </Text>
        </View>
      )}
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#111' : '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: theme === DARK_THEME ? '#666' : '#999',
  },
}); 