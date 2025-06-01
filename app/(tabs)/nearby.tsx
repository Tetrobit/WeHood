import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DARK_THEME, LIGHT_THEME, useThemeName } from '@/core/hooks/useTheme';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'geo', label: 'Геоточки' },
  { key: 'images', label: 'Картинки' },
  { key: 'shorts', label: 'Короткие видео' },
];

const IMAGES = [
  { id: 1, uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', distance: '9,56 км' },
  { id: 2, uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', distance: '970 м' },
  { id: 3, uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', distance: '30 км' },
  { id: 4, uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', distance: '15 км' },
  { id: 5, uri: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', distance: '350 м' },
  { id: 6, uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', distance: '2 км' },
  { id: 7, uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', distance: '—' },
  { id: 8, uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', distance: '—' },
];

export default function NearbyScreen() {
  const [activeTab, setActiveTab] = useState('images');
  const theme = useThemeName();
  const styles = makeStyles(theme!);

  return (
    <View style={styles.container}>
      {/* Верхняя панель */}
      <View style={styles.header}>
        <View>
          <Text style={styles.district}>Вахитовский район</Text>
          <Text style={styles.city}>Казань</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons 
            name="tune" 
            size={24} 
            color={theme === DARK_THEME ? '#fff' : '#222'} 
          />
        </TouchableOpacity>
      </View>

      {/* Табы */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Сетка картинок */}
      <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {IMAGES.map((img, idx) => (
            <View key={img.id} style={[styles.card, idx % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}> 
              <Image source={{ uri: img.uri }} style={styles.image} />
              {img.distance !== '—' && (
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{img.distance}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
    borderBottomWidth: 1,
  },
  district: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  city: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginTop: 2,
  },
  filterBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
  },
  tabActive: {
    backgroundColor: theme === DARK_THEME ? '#555' : '#222',
  },
  tabText: {
    fontSize: 15,
    color: theme === DARK_THEME ? '#fff' : '#222',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  gridScroll: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 80,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 32) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#333' : '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  distanceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});