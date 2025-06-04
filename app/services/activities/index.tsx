import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Searchbar, Chip } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Activity = {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  schedule: string;
  price: string;
  location: string;
  rating: number;
};

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Школа танцев "Ритм"',
    category: 'Танцы',
    ageRange: '5-12 лет',
    schedule: 'Пн, Ср, Пт 16:00-17:30',
    price: '3000₽/месяц',
    location: 'ул. Ленина, 15',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Футбольная секция "Чемпион"',
    category: 'Спорт',
    ageRange: '7-14 лет',
    schedule: 'Вт, Чт 15:00-16:30, Сб 10:00-11:30',
    price: '4000₽/месяц',
    location: 'Спортивный комплекс "Олимп"',
    rating: 4.9
  },
  {
    id: '3',
    title: 'Художественная студия',
    category: 'Искусство',
    ageRange: '4-15 лет',
    schedule: 'Ср, Сб 11:00-12:30',
    price: '3500₽/месяц',
    location: 'ул. Пушкина, 7',
    rating: 4.7
  }
];

const categories = ['Все', 'Спорт', 'Танцы', 'Музыка', 'Искусство', 'Наука', 'Языки'];

export default function ActivitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Детские секции и кружки</Text>
        <Searchbar
          placeholder="Поиск секций"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme === 'dark' ? '#fff' : '#000'}
          inputStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
              textStyle={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryChipText]}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.activitiesContainer}>
        {filteredActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            onPress={() => router.push('/services/activities/apply')}
            activeOpacity={0.7}
          >
            <Card style={styles.activityCard}>
              <Card.Content>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTitleContainer}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{activity.rating}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={16} color="#666" />
                    <Text style={styles.detailText}>{activity.schedule}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="account-child" size={16} color="#666" />
                    <Text style={styles.detailText}>{activity.ageRange}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                    <Text style={styles.detailText}>{activity.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="currency-rub" size={16} color="#666" />
                    <Text style={styles.detailText}>{activity.price}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
  },
  categoriesContainer: {
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
  },
  categoryChipText: {
    color: theme === 'dark' ? '#fff' : '#000',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  activitiesContainer: {
    flex: 1,
    padding: 16,
  },
  activityCard: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: theme === 'dark' ? '#fff' : '#000',
    fontWeight: '600',
  },
  activityDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: theme === 'dark' ? '#ccc' : '#666',
    flex: 1,
  },
}); 