import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useThemeName();
  const styles = makeStyles(theme);

  // TODO: Replace with API call to get listing details
  const listing = {
    id: '1',
    title: 'Велосипед горный',
    price: 15000,
    description: 'Горный велосипед в отличном состоянии. Подойдет как для городской езды, так и для загородных прогулок. В комплекте: велосипед, насос, набор инструментов для обслуживания.',
    category: 'Спорт и отдых',
    image: 'https://via.placeholder.com/300',
    author: {
      name: 'Александр',
      rating: 4.8,
      phone: '+7 (999) 123-45-67',
    },
    createdAt: '2024-03-20',
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {listing.image && (
          <Image 
            source={{ uri: listing.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>{listing.price} ₽</Text>
          
          <View style={styles.categoryContainer}>
            <MaterialCommunityIcons name="tag" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
            <Text style={styles.category}>{listing.category}</Text>
          </View>

          <View style={styles.authorContainer}>
            <MaterialCommunityIcons name="account" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
            <Text style={styles.authorName}>{listing.author.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{listing.author.rating}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Дата публикации</Text>
            <Text style={styles.date}>{new Date(listing.createdAt).toLocaleDateString('ru-RU')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => {/* TODO: Implement phone call */}}
          style={styles.button}
          icon="phone"
        >
          Позвонить продавцу
        </Button>
      </View>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  category: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  authorName: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  date: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderTopWidth: 1,
    borderTopColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
  },
}); 