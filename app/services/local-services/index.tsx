import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Searchbar, FAB } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Service = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  author: {
    name: string;
    rating: number;
  };
};

// Моки для местных служб
const demoServices: Service[] = [
  {
    id: '1',
    title: 'Сантехник',
    price: 1200,
    description: 'Устранение протечек, замена смесителей, установка сантехники',
    category: 'Сантехник',
    image: 'https://img.freepik.com/free-photo/plumbing-professional-doing-his-job_23-2150721533.jpg',
    author: { name: 'Павел', rating: 4.8 },
  },
  {
    id: '2',
    title: 'Электрик',
    price: 1500,
    description: 'Проводка, розетки, светильники, устранение коротких замыканий',
    category: 'Электрик',
    image: 'https://s12.stc.yc.kpcdn.net/share/i/12/10559593/wr-960.webp',
    author: { name: 'Андрей', rating: 4.7 },
  },
  {
    id: '3',
    title: 'Ремонт квартир',
    price: 5000,
    description: 'Косметический и капитальный ремонт, отделка, покраска',
    category: 'Ремонт',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Виктор', rating: 4.9 },
  },
  {
    id: '4',
    title: 'Уборка помещений',
    price: 1000,
    description: 'Генеральная и поддерживающая уборка квартир и офисов',
    category: 'Уборка',
    image: 'https://kazan-luxcleaning.ru/wp-content/uploads/2020/05/8a80b3fe46ffab30b695f24963aef4b6.jpeg',
    author: { name: 'Мария', rating: 4.6 },
  },
  {
    id: '5',
    title: 'Курьерские услуги',
    price: 500,
    description: 'Доставка документов, покупок, еды по району',
    category: 'Курьер',
    image: 'https://a.d-cd.net/a55f70ds-960.jpg',
    author: { name: 'Игорь', rating: 4.5 },
  },
  {
    id: '6',
    title: 'Репетитор по математике',
    price: 800,
    description: 'Подготовка к экзаменам, помощь с домашними заданиями',
    category: 'Репетитор',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Елена', rating: 4.9 },
  },
];

const categories = ['Все', 'Сантехник', 'Электрик', 'Ремонт', 'Уборка', 'Курьер', 'Репетитор', 'Другое'];

export default function LocalServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredServices = demoServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/services')} style={{ position: 'absolute', left: 16, zIndex: 1 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { flex: 1, textAlign: 'center' }]}>Местные службы</Text>
        <View style={{ width: 28, opacity: 0 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <Searchbar
          iconColor={theme === 'dark' ? '#fff' : '#000'}
          cursorColor={theme === 'dark' ? '#fff' : '#000'}
          placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          inputStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
          placeholder="Поиск услуг"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.productsContainer}>
        {filteredServices.map((service) => (
          <Card 
            key={service.id} 
            style={styles.productCard}
            onPress={() => router.push(`/services/local-services/${service.id}`)}
          >
            {service.image && (
              <Card.Cover source={{ uri: service.image }} style={styles.productImage} />
            )}
            <Card.Content>
              <Text style={styles.productTitle}>{service.title}</Text>
              <Text style={styles.productPrice}>{service.price} ₽</Text>
              <Text style={styles.productDescription}>{service.description}</Text>
              <View style={styles.authorContainer}>
                <MaterialCommunityIcons name="account" size={20} color="#666" />
                <Text style={styles.authorName}>{service.author.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{service.author.rating}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/services/local-services/new')}
      />
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
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  categoriesScroll: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#00D26A',
  },
  categoryText: {
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  productImage: {
    height: 200,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  productDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  authorName: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00D26A',
  },
}); 