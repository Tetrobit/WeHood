import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import FlatCard from '@/app/components/FlatCard';
import { IFlat } from '@/app/types/flat';

// Моковые данные для примера
const mockFlats: IFlat[] = [
  {
    id: '1',
    title: '2-комнатная квартира в центре',
    description: 'Светлая просторная квартира с современным ремонтом',
    price: 35000,
    address: 'ул. Пушкина, д. 10',
    distance: 800,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    rooms: 2,
    area: 54,
    floor: 4,
    totalFloors: 9,
    views: 128,
    currentViewers: 3,
    createdAt: new Date().toISOString(),
    landlord: {
      id: '1',
      name: 'Анна',
      phone: '+7 (999) 123-45-67',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  },
  {
    id: '2',
    title: 'Студия с видом на парк',
    description: 'Уютная студия с панорамными окнами',
    price: 28000,
    address: 'ул. Ленина, д. 15',
    distance: 1200,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
    rooms: 1,
    area: 32,
    floor: 7,
    totalFloors: 12,
    views: 95,
    currentViewers: 2,
    createdAt: new Date().toISOString(),
    landlord: {
      id: '2',
      name: 'Михаил',
      phone: '+7 (999) 234-56-78',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  },
];

export default function FlatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredFlats = mockFlats.filter(flat =>
    flat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flat.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={theme === 'dark' ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={styles.title}>Аренда квартир</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/services/flats/favorites')}
          >
            <MaterialCommunityIcons 
              name="heart-outline" 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons 
              name="tune" 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Searchbar
        placeholder="Поиск по адресу или описанию"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme === 'dark' ? '#fff' : '#000'}
        inputStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredFlats.map(flat => (
          <FlatCard key={flat.id} flat={flat} />
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/services/flats/new')}
        color="#fff"
      />
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#111' : '#f5f5f5',
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
    color: theme === 'dark' ? '#fff' : '#000',
    textAlign: 'center',
  },
  searchBar: {
    margin: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#44944A',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
});