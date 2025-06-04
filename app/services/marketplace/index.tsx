import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Searchbar, FAB } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Product = {
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

// Демо-данные для примера
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Велосипед горный',
    price: 15000,
    description: 'Горный велосипед в отличном состоянии',
    category: 'Спорт и отдых',
    image: 'https://via.placeholder.com/300',
    author: {
      name: 'Александр',
      rating: 4.8,
    },
  },
  {
    id: '2',
    title: 'Уборка квартир',
    price: 2500,
    description: 'Профессиональная уборка квартир и домов',
    category: 'Услуги',
    author: {
      name: 'Мария',
      rating: 4.9,
    },
  },
];

const categories = ['Все', 'Вещи', 'Услуги', 'Спорт и отдых', 'Электроника', 'Другое'];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredProducts = demoProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Товары и услуги</Text>
        <Searchbar
          iconColor={theme === 'dark' ? '#fff' : '#000'}
          cursorColor={theme === 'dark' ? '#fff' : '#000'}
          placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          inputStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
          placeholder="Поиск товаров и услуг"
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
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            style={styles.productCard}
            onPress={() => router.push({
              pathname: '/services/marketplace/[id]',
              params: {
                id: product.id,
              },
            })}
          >
            {product.image && (
              <Card.Cover source={{ uri: product.image }} style={styles.productImage} />
            )}
            <Card.Content>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPrice}>{product.price} ₽</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <View style={styles.authorContainer}>
                <MaterialCommunityIcons name="account" size={20} color="#666" />
                <Text style={styles.authorName}>{product.author.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{product.author.rating}</Text>
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
        onPress={() => router.push('/services/marketplace/new')}
        label="Разместить объявление"
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
  },
}); 