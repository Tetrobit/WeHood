import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type ServiceIcon = 'hand-heart' | 'calendar-star' | 'bullhorn' | 'account-group';

const mockNews = [
  {
    id: '1',
    title: 'Субботник в парке',
    description: 'В эту субботу состоится уборка территории парка. Приглашаем всех желающих!',
    time: '2 часа назад',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84',
  },
  {
    id: '2',
    title: 'Новая детская площадка',
    description: 'В нашем районе открылась современная детская площадка',
    time: '4 часа назад',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
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

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Погода и локация */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <TouchableOpacity onPress={() => {router.push('/weather')}} style={styles.weatherContainer}>
            <MaterialCommunityIcons name="weather-sunny" size={40} color="#ebb010" />
            <Text style={styles.temperature}>+23°</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.location}>Вахитовский район</Text>
            <Text style={styles.city}>Казань</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {router.push('/profile')}}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Совместные поездки */}
      <Card style={styles.rideCard}>
        <Card.Content>
          <View style={styles.rideContent}>
            <View style={styles.rideTextContainer}>
              <Text style={styles.rideTitle}>Совместные поездки</Text>
              <Text style={styles.rideSubtitle}>Находите попутчиков{'\n'}рядом с Вами</Text>
              <Button 
                mode="contained" 
                style={styles.rideButton}
                onPress={() => {router.push('/rides' as any)}}
              >
                Найти поездку
              </Button>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2' }}
              style={styles.carImage}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Сервисы */}
      <View style={styles.findAllContainer}>
        <Text style={styles.findAllTitle}>Сервисы</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceItem}
              onPress={() => {router.push(`/services/${service.id}` as any)}}
            >
              <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                <MaterialCommunityIcons name={service.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Лента новостей */}
      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Лента новостей</Text>
        {mockNews.map((news) => (
          <Card key={news.id} style={styles.newsCard}>
            <Card.Cover source={{ uri: news.image }} style={styles.newsImage} />
            <Card.Content>
              <Text style={styles.newsItemTitle}>{news.title}</Text>
              <Text style={styles.newsDescription}>{news.description}</Text>
              <Text style={styles.newsTime}>{news.time}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    marginRight: 12,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
  },
  city: {
    fontSize: 14,
    color: '#666',
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
  },
  rideSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  rideButton: {
    borderRadius: 8,
    marginTop: 8,
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
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  newsContainer: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  newsImage: {
    height: 160,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
});
