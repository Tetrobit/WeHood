import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Searchbar, FAB } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
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

// Моки для барахолки
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Куртка зимняя',
    price: 2500,
    description: 'Тёплая зимняя куртка, размер M',
    category: 'Одежда',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Ольга', rating: 4.7 },
  },
  {
    id: '2',
    title: 'Диван раскладной',
    price: 8000,
    description: 'Удобный диван, есть небольшие потертости',
    category: 'Мебель',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Иван', rating: 4.9 },
  },
  {
    id: '3',
    title: 'Смартфон Samsung',
    price: 6000,
    description: 'Рабочий, без царапин, полный комплект',
    category: 'Техника',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Артём', rating: 4.8 },
  },
  {
    id: '4',
    title: 'Детская коляска',
    price: 3500,
    description: 'В хорошем состоянии, после одного ребёнка',
    category: 'Детское',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Марина', rating: 4.6 },
  },
  {
    id: '5',
    title: 'Гантели 2x5 кг',
    price: 1200,
    description: 'Пара гантелей для домашних тренировок',
    category: 'Спорт',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Сергей', rating: 4.5 },
  },
  {
    id: '6',
    title: 'Книга "1984" Дж. Оруэлл',
    price: 300,
    description: 'В отличном состоянии, мягкая обложка',
    category: 'Книги',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Екатерина', rating: 4.9 },
  },
];

const categories = ['Все', 'Одежда', 'Мебель', 'Техника', 'Книги', 'Спорт', 'Детское', 'Другое'];

export default function FleaMarketScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const theme = useThemeName() ?? 'light';
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
        <TouchableOpacity onPress={() => router.replace('/services')} style={{ position: 'absolute', left: 16, zIndex: 1 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme === DARK_THEME ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { flex: 1, textAlign: 'center' }]}>Барахолка</Text>
        <View style={{ width: 28, opacity: 0 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <Searchbar
          iconColor={theme === DARK_THEME ? '#fff' : '#000'}
          cursorColor={theme === DARK_THEME ? '#fff' : '#000'}
          placeholderTextColor={theme === DARK_THEME ? '#fff' : '#000'}
          inputStyle={{ color: theme === DARK_THEME ? '#fff' : '#000' }}
          placeholder="Поиск товаров"
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
            onPress={() => router.push({ pathname: '/services/flea-market/[id]', params: { id: product.id } })}
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
        onPress={() => router.push({ pathname: '/services/flea-market/new' })}
      />
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  categoriesScroll: {
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#00B894',
  },
  categoryText: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#fff' : '#666',
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
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  productImage: {
    height: 200,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  productDescription: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
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
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF9800',
  },
}); 