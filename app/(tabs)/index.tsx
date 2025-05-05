import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const mockNews = [
  {
    id: '1',
    title: 'Субботник в парке',
    description: 'В эту субботу состоится уборка территории парка. Приглашаем всех желающих!',
    time: '2 часа назад',
  },
  {
    id: '2',
    title: 'Новая детская площадка',
    description: 'В нашем районе открылась современная детская площадка',
    time: '4 часа назад',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Погода и локация */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <TouchableOpacity onPress={() => {console.log('weather')}} style={styles.weatherContainer}>
            <MaterialCommunityIcons name="weather-sunny" size={40} color="#ebb010" />
            <Text style={styles.temperature}>+23</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.location}>Вахитовский район</Text>
            <Text style={styles.city}>Казань</Text>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Совместные поездки */}
      <Card style={styles.rideCard}>
        <Card.Content>
          <View style={styles.rideContent}>
            <View style={styles.rideTextContainer}>
              <Text style={styles.rideTitle}>Совместные поездки</Text>
              <Text style={styles.rideSubtitle}>Находите попутчиков{'\n'}рядом с Вами</Text>
            </View>
            {/* <Image 
              source={require('../../assets/images/car.png')}
              style={styles.carImage}
            /> */}
          </View>
        </Card.Content>
      </Card>

      {/* Найдем все */}
      <View style={styles.findAllContainer}>
        <Text style={styles.findAllTitle}>Найдем все</Text>
        <View style={styles.servicesGrid}>
          <Text style={styles.servicesTitle}>Сервисы</Text>
        </View>
      </View>

      {/* Лента новостей */}
      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Лента новостей</Text>
        {mockNews.map((news) => (
          <Card key={news.id} style={styles.newsCard}>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingRight: 0,
    borderRadius: 10,
    boxShadow: '-2px 2px 8px rgba(0, 0, 0, 0.07)',
    marginRight: 10,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
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
    width: '100%',
    height: '100%',
  },
  rideCard: {
    margin: 16,
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rideSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  carImage: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
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
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 16,
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
    marginBottom: 12,
    borderRadius: 12,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
});
