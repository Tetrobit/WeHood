import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card, Chip, Menu, Divider, Button } from 'react-native-paper';
import { IFlat } from '@/app/types/flat';

// Моковые данные для демонстрации
const mockViewedFlats: (IFlat & { viewedAt: string; isHidden?: boolean })[] = [
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
    viewedAt: '2024-03-20T15:30:00Z',
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
    viewedAt: '2024-03-19T10:15:00Z',
    isHidden: true,
    createdAt: new Date().toISOString(),
    landlord: {
      id: '2',
      name: 'Михаил',
      phone: '+7 (999) 234-56-78',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  },
];

type SortOption = 'date' | 'price-asc' | 'price-desc';

export default function ViewedFlatsScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);
  
  const [viewedFlats, setViewedFlats] = useState(mockViewedFlats);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [showHidden, setShowHidden] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFlatId, setSelectedFlatId] = useState<string | null>(null);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    let sortedFlats = [...viewedFlats];
    
    switch (option) {
      case 'date':
        sortedFlats.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
        break;
      case 'price-asc':
        sortedFlats.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedFlats.sort((a, b) => b.price - a.price);
        break;
    }
    
    setViewedFlats(sortedFlats);
  };

  const toggleHideFlat = (id: string) => {
    setViewedFlats(prev => prev.map(flat => 
      flat.id === id ? { ...flat, isHidden: !flat.isHidden } : flat
    ));
    setMenuVisible(false);
  };

  const deleteFromHistory = (id: string) => {
    setViewedFlats(prev => prev.filter(flat => flat.id !== id));
    setMenuVisible(false);
  };

  const filteredFlats = viewedFlats.filter(flat => showHidden || !flat.isHidden);

  const formatViewedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={theme === DARK_THEME ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={styles.title}>Просмотренные квартиры</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip 
            selected={sortBy === 'date'} 
            onPress={() => handleSort('date')}
            style={styles.chip}
          >
            По дате просмотра
          </Chip>
          <Chip 
            selected={sortBy === 'price-asc'} 
            onPress={() => handleSort('price-asc')}
            style={styles.chip}
          >
            Сначала дешевле
          </Chip>
          <Chip 
            selected={sortBy === 'price-desc'} 
            onPress={() => handleSort('price-desc')}
            style={styles.chip}
          >
            Сначала дороже
          </Chip>
          <Chip 
            selected={showHidden} 
            onPress={() => setShowHidden(!showHidden)}
            style={styles.chip}
          >
            Показать скрытые
          </Chip>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredFlats.map(flat => (
          <Card key={flat.id} style={[styles.flatCard, flat.isHidden && styles.hiddenCard]}>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/services/flats/[id]',
                params: { id: flat.id }
              })}
            >
              <Card.Cover source={{ uri: flat.images[0] }} style={styles.image} />
              <Card.Content>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{flat.price.toLocaleString()} ₽/мес</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setSelectedFlatId(flat.id);
                      setMenuVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons 
                      name="dots-vertical" 
                      size={24} 
                      color={theme === DARK_THEME ? '#fff' : '#000'} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.flatTitle}>{flat.title}</Text>
                <Text style={styles.address}>{flat.address}</Text>
                
                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="bed" size={20} color={theme === DARK_THEME ? '#fff' : '#000'} />
                    <Text style={styles.detailText}>{flat.rooms} комн.</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="ruler" size={20} color={theme === DARK_THEME ? '#fff' : '#000'} />
                    <Text style={styles.detailText}>{flat.area} м²</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="stairs" size={20} color={theme === DARK_THEME ? '#fff' : '#000'} />
                    <Text style={styles.detailText}>{flat.floor}/{flat.totalFloors} эт.</Text>
                  </View>
                </View>

                <View style={styles.viewedInfo}>
                  <Text style={styles.viewedText}>
                    Просмотрено: {formatViewedDate(flat.viewedAt)}
                  </Text>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item 
          onPress={() => selectedFlatId && toggleHideFlat(selectedFlatId)} 
          title={viewedFlats.find(f => f.id === selectedFlatId)?.isHidden ? "Показать" : "Скрыть"} 
          leadingIcon="eye-off"
        />
        <Menu.Item 
          onPress={() => selectedFlatId && deleteFromHistory(selectedFlatId)} 
          title="Удалить из истории" 
          leadingIcon="delete"
        />
      </Menu>

      {viewedFlats.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="eye-off" size={48} color="#666" />
          <Text style={styles.emptyStateText}>История просмотров пуста</Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/services/flats')}
            style={styles.browseButton}
          >
            Смотреть квартиры
          </Button>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  chip: {
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#fff' : '#f5f5f5'
  },
  content: {
    flex: 1,
    padding: 16,
  },
  flatCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  hiddenCard: {
    opacity: 0.6,
  },
  image: {
    height: 200,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  flatTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  viewedInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  viewedText: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    width: '100%',
    maxWidth: 300,
  },
}); 