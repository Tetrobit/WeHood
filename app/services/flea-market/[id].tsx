import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

export default function FleaMarketDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useThemeName() ?? 'light';
  const styles = makeStyles(theme);

  // Моки товаров, как в index.tsx
  const products = [
    {
      id: '1',
      title: 'Куртка зимняя',
      price: 2500,
      description: 'Тёплая зимняя куртка, размер M',
      category: 'Одежда',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Ольга', rating: 4.7, phone: '+7 (999) 123-45-67' },
      createdAt: '2024-03-20',
    },
    {
      id: '2',
      title: 'Диван раскладной',
      price: 8000,
      description: 'Удобный диван, есть небольшие потертости',
      category: 'Мебель',
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Иван', rating: 4.9, phone: '+7 (999) 123-45-68' },
      createdAt: '2024-03-19',
    },
    {
      id: '3',
      title: 'Смартфон Samsung',
      price: 6000,
      description: 'Рабочий, без царапин, полный комплект',
      category: 'Техника',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Артём', rating: 4.8, phone: '+7 (999) 123-45-69' },
      createdAt: '2024-03-18',
    },
    {
      id: '4',
      title: 'Детская коляска',
      price: 3500,
      description: 'В хорошем состоянии, после одного ребёнка',
      category: 'Детское',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Марина', rating: 4.6, phone: '+7 (999) 123-45-70' },
      createdAt: '2024-03-17',
    },
    {
      id: '5',
      title: 'Гантели 2x5 кг',
      price: 1200,
      description: 'Пара гантелей для домашних тренировок',
      category: 'Спорт',
      image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Сергей', rating: 4.5, phone: '+7 (999) 123-45-71' },
      createdAt: '2024-03-16',
    },
    {
      id: '6',
      title: 'Книга "1984" Дж. Оруэлл',
      price: 300,
      description: 'В отличном состоянии, мягкая обложка',
      category: 'Книги',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Екатерина', rating: 4.9, phone: '+7 (999) 123-45-72' },
      createdAt: '2024-03-15',
    },
  ];
  const product = products.find(p => p.id === id) ?? null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {product && product.image && (
          <Image 
            source={{ uri: product.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          {product ? (
            <>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>{product.price} ₽</Text>
              
              <View style={styles.categoryContainer}>
                <MaterialCommunityIcons name="tag" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
                <Text style={styles.category}>{product.category}</Text>
              </View>

              <View style={styles.authorContainer}>
                <MaterialCommunityIcons name="account" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
                <Text style={styles.authorName}>{product.author.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{product.author.rating}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Дата публикации</Text>
                <Text style={styles.date}>{new Date(product.createdAt).toLocaleDateString('ru-RU')}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.title}>Товар не найден</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {product && product.author && product.author.phone && (
          <Button
            mode="contained"
            onPress={() => Linking.openURL(`tel:${product.author.phone}`)}
            style={styles.button}
            icon="phone"
          >
            Позвонить продавцу
          </Button>
        )}
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
    backgroundColor: '#00B894',
  },
}); 