import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import ImageGallery from '@/app/components/ImageGallery';
import { IFlatDetails, IReview } from '@/app/types/flat';

// Моковые данные для примера
const mockFlat: IFlatDetails = {
  id: '1',
  title: '2-комнатная квартира в центре',
  description: 'Светлая просторная квартира с современным ремонтом. В квартире есть все необходимое для комфортного проживания: мебель, бытовая техника, интернет. Развитая инфраструктура района, рядом магазины, школы, детские сады, парки.',
  price: 35000,
  address: 'ул. Пушкина, д. 10',
  distance: 800,
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  ],
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
  reviews: [
    {
      id: '1',
      userId: '2',
      userName: 'Михаил',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      comment: 'Отличный дом, хорошая звукоизоляция, приветливые соседи',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      userId: '3',
      userName: 'Елена',
      userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 4,
      comment: 'Район очень удобный, все рядом. Единственный минус - парковка',
      createdAt: '2024-01-10T15:30:00Z',
    },
  ],
};

export default function FlatDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useThemeName();
  const styles = makeStyles(theme);

  // В реальном приложении здесь будет запрос к API
  const flat = mockFlat;

  const handleCall = () => {
    Linking.openURL(`tel:${flat.landlord.phone}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <MaterialCommunityIcons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <ImageGallery images={flat.images} />

      <View style={styles.content}>
        {/* Заголовок и основная информация */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={theme === DARK_THEME ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
          <Text style={styles.price}>{flat.price.toLocaleString()} ₽/мес</Text>
        </View>

        <Text style={styles.title}>{flat.title}</Text>
        <Text style={styles.address}>{flat.address}</Text>

        {/* Детали квартиры */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="bed" size={24} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.rooms} комн.</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="ruler" size={24} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.area} м²</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="stairs" size={24} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.floor}/{flat.totalFloors} эт.</Text>
          </View>
        </View>

        {/* Статистика просмотров */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="eye" size={24} color="#4ECDC4" />
            <Text style={styles.statValue}>{flat.views}</Text>
            <Text style={styles.statLabel}>просмотров</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#4ECDC4" />
            <Text style={styles.statValue}>{flat.currentViewers}</Text>
            <Text style={styles.statLabel}>смотрят сейчас</Text>
          </View>
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>{flat.description}</Text>
        </View>

        {/* Контакты арендодателя */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Арендодатель</Text>
          <View style={styles.landlord}>
            <View style={styles.landlordInfo}>
              <Text style={styles.landlordName}>{flat.landlord.name}</Text>
              <Text style={styles.landlordPhone}>{flat.landlord.phone}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <MaterialCommunityIcons name="phone" size={24} color="#fff" />
              <Text style={styles.callButtonText}>Позвонить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Отзывы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Отзывы о доме</Text>
          {flat.reviews.map((review) => (
            <View key={review.id} style={styles.review}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.userName}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.rating}>
                {renderStars(review.rating)}
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#111' : '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme === DARK_THEME ? '#ddd' : '#333',
  },
  landlord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderRadius: 12,
    padding: 16,
  },
  landlordInfo: {
    flex: 1,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 4,
  },
  landlordPhone: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  review: {
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  reviewDate: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme === DARK_THEME ? '#ddd' : '#333',
  },
}); 