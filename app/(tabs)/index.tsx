import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { useQuery } from '@realm/react';
import UserModel from '@/core/models/UserModel';
import Carousel from 'react-native-reanimated-carousel';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import useApi from '@/core/hooks/useApi';
import { useGeolocation } from '@/core/hooks/useGeolocation';
import useWeather from '@/core/hooks/useWeather';
import { getWeatherIcon } from '@/core/utils/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window');

type ServiceIcon = 'hand-heart' | 'calendar-star' | 'bullhorn' | 'account-group';

type NewsItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Субботник в парке',
    description: 'В эту субботу состоится уборка территории парка. Приглашаем всех желающих!',
    time: '2 часа назад',
    image: 'https://img.freepik.com/premium-vector/people-collecting-garbage-city-park-men-women-volunteers-cleaning-park-together-from-trash_461812-205.jpg', // люди убираются в парке
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    title: 'Новая детская площадка',
    description: 'В нашем районе открылась современная детская площадка',
    time: '4 часа назад',
    image: 'https://sp-izumrud.ru/wp-content/uploads/2018/08/Sanatorij-Izumrud-19.jpg', // современная детская площадка
    likes: 8,
    comments: 1,
  },
];

const services: Array<{
  id: string;
  title: string;
  icon: ServiceIcon;
  color: string;
}> = [
  { id: '1', title: 'Помощь', icon: 'hand-heart', color: '#FF6B6B' },
  { id: '2', title: 'События', icon: 'calendar-star', color: '#4ECDC4' },
  { id: '3', title: 'Объявления', icon: 'bullhorn', color: '#FFD93D' },
  { id: '4', title: 'Соседи', icon: 'account-group', color: '#95E1D3' },
];

const carouselData = [
  {
    id: '1',
    title: 'Добро пожаловать в WeHood',
    description: 'Ваш районный помощник',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84',
  },
  {
    id: '2',
    title: 'Будьте активны',
    description: 'Участвуйте в жизни района',
    image: 'https://img.freepik.com/free-photo/people-attending-therapy-meeting_23-2151083315.jpg', // бегущий человек на фоне природы
  },
  {
    id: '3',
    title: 'Помогайте соседям',
    description: 'Создавайте крепкое сообщество',
    image: 'https://img.freepik.com/free-photo/business-agreement-handshake-hand-gesture_53876-130006.jpg',
  },
];

const serviceImages: Record<string, string> = {
  'Помощь': 'https://cdn-icons-png.flaticon.com/512/616/616494.png', // рукопожатие, цветная
  'События': 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png', // календарь, цветной
  'Объявления': 'https://cdn-icons-png.flaticon.com/512/1827/1827349.png', // мегафон, цветной
  'Соседи': 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', // люди, цветные
};

export default function HomeScreen() {
  const [profile] = useQuery(UserModel);
  const [avatarUri, setAvatarUri] = useState(profile?.avatar);
  const [theme] = useTheme();
  const styles = makeStyles(theme!);
  const { lastLocation, requestGeolocation } = useGeolocation();
  const { lastWeatherForecast } = useWeather();
  const [newsList, setNewsList] = useState<NewsItem[]>(mockNews);

  const renderCarouselItem = ({ item }: { item: typeof carouselData[0] }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <View style={styles.carouselTextContainer}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </View>
    </View>
  );

  let weatherColor = '#ebb010';
  if (lastWeatherForecast?.list?.[0]?.weather[0]?.main === 'Clear' && ((new Date().getHours() < 6 || new Date().getHours() > 18))) {
    if (theme === 'dark') {
      weatherColor = '#ffffff';
    } else {
      weatherColor = '#023e8a';
    }
  }
  else if (lastWeatherForecast?.list?.[0]?.weather[0]?.main === 'Clear' && ((new Date().getHours() > 6 && new Date().getHours() < 18))) {
    weatherColor = '#ebb010';
  }
  else {
    if (theme === 'dark') {
      weatherColor = '#ffffff';
    } else {
      weatherColor = '#000000';
    }
  }

  React.useEffect(() => {
    requestGeolocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchNewsData = async () => {
        const updatedNews = await Promise.all(mockNews.map(async (item) => {
          const stored = await AsyncStorage.getItem(`news_likes_${item.id}`);
          let liked = false;
          if (stored) {
            const parsed = JSON.parse(stored);
            liked = !!parsed.liked;
            // Для комментариев тоже пробуем получить из хранилища
            const commentsStored = await AsyncStorage.getItem(`news_comments_${item.id}`);
            let commentsCount = item.comments;
            if (commentsStored) {
              try {
                const commentsArr = JSON.parse(commentsStored);
                if (Array.isArray(commentsArr)) commentsCount = commentsArr.length;
              } catch {}
            }
            return { ...item, likes: parsed.likes, comments: commentsCount, liked };
          } else {
            return { ...item, liked };
          }
        }));
        setNewsList(updatedNews);
      };
      fetchNewsData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Погода и локация */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <TouchableOpacity onPress={() => {router.push('/weather')}} style={styles.weatherContainer}>
            {getWeatherIcon(lastWeatherForecast?.list?.[0]?.weather?.[0]?.main || 'Clear', weatherColor, 30)}
            <Text style={[styles.temperature, { color: weatherColor }]}>{Math.round(lastWeatherForecast?.list?.[0]?.main?.temp - 273.15) || '0'}°C</Text>
            
            
          </TouchableOpacity>
          <View style={styles.locationTextContainer}>
            <Text style={styles.location}>{lastLocation?.locality}</Text>
            <Text style={styles.city}>{lastLocation?.district}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {router.push('/profile')}}>
          <Image 
            source={{ uri: profile?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      
      {/* Слайдер */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop={true}
          width={Dimensions.get('screen').width}
          height={200}
          snapEnabled={true}
          pagingEnabled={true}
          mode="parallax"
          autoPlayInterval={2000}
          data={carouselData}
          style={{ width: "100%" }}
          onSnapToItem={(index) => {}}
          renderItem={renderCarouselItem}
        />
      </View>

      {/* Сервисы */}
      <View style={styles.findAllContainer}>
        <Text style={styles.findAllTitle}>Сервисы</Text>
        <View style={styles.servicesGridModern}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceModernCard}
              activeOpacity={0.85}
              onPress={() => {
                if (service.title === 'Объявления') {
                  router.push('/services/events/events');
                } else if (service.title === 'События') {
                  router.push('/services/events-city/events');
                } else if (service.title === 'Помощь') {
                  router.push('/services/help/events');
                } else {
                  router.push(`/services/${service.id}` as any);
                }
              }}
            >
              <View style={styles.serviceModernContent}>
                <View style={styles.serviceModernTextBlock}>
                  <Text style={styles.serviceModernTitle}>{service.title}</Text>
                </View>
                <View style={styles.serviceModernImage}>
                  <MaterialCommunityIcons
                    name={service.icon}
                    size={32}
                    color={service.color}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Лента новостей */}
      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Лента новостей</Text>
        {newsList.map((news) => (
          <TouchableOpacity key={news.id} activeOpacity={0.9} onPress={() => router.push({ pathname: '/news/[id]', params: { id: news.id } })}>
            <Card style={styles.newsCard}>
              <Card.Cover source={{ uri: news.image }} style={styles.newsImage} />
              <Card.Content>
                <Text style={styles.newsItemTitle}>{news.title}</Text>
                <Text style={styles.newsDescription}>{news.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <MaterialCommunityIcons name={news.liked ? 'heart' : 'heart-outline'} size={18} color="#FF6B6B" style={{ marginRight: 4 }} />
                  <Text style={{ color: '#FF6B6B', marginRight: 16, fontSize: 13 }}>{news.likes}</Text>
                  <MaterialCommunityIcons name="comment-outline" size={18} color="#00D26A" style={{ marginRight: 4 }} />
                  <Text style={{ color: '#00D26A', fontSize: 13 }}>{news.comments}</Text>
                </View>
                <Text style={styles.newsTime}>{news.time}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  servicesGridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceModernCard: {
    width: (width - 48) / 2,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#111' : '#fff',
  },
  serviceModernContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  serviceModernTextBlock: {
    flex: 1,
    zIndex: 2,
  },
  serviceModernTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#111',
    marginBottom: 2,
  },
  serviceModernImage: {
    marginTop: 10,
    alignSelf: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 8,
    backgroundColor: theme === 'dark' ? '#000000' : '#fff',
    elevation: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ebb010',
    marginLeft: 3,
  },
  locationTextContainer: {
    marginLeft: 6,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: theme === 'dark' ? '#222' : '#eee',
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  city: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rideCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  rideContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideTextContainer: {
    flex: 1,
  },
  rideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  rideSubtitle: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  rideButton: {
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: theme === 'dark' ? '#444' : '#000',
  },
  carImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  findAllContainer: {
    padding: 16,
  },
  findAllTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  newsContainer: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  newsImage: {
    height: 160,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  newsDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  newsTime: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  carouselContainer: {
    marginTop: 8,
  },
  carouselItem: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#fff',
  },
});
