import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Моки для моих объявлений в барахолке
const myProducts = [
  {
    id: '1',
    title: 'Куртка зимняя',
    price: 2500,
    description: 'Тёплая зимняя куртка, размер M',
    category: 'Одежда',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Ольга', rating: 4.7 },
    views: 156,
    favorites: 12,
    contacts: 8,
    publishedAt: '2024-03-01',
    status: 'active'
  },
  {
    id: '2',
    title: 'Диван раскладной',
    price: 8000,
    description: 'Удобный диван, есть небольшие потертости',
    category: 'Мебель',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Ольга', rating: 4.7 },
    views: 234,
    favorites: 28,
    contacts: 15,
    publishedAt: '2024-03-10',
    status: 'active'
  }
];

export default function MyFleaMarketScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои объявления</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {myProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => router.push(`/services/flea-market/${product.id}`)}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: product.image }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price} ₽</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#FF9800' }]}
        onPress={() => router.push('/services/flea-market/new')}
      />
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    color: theme === 'dark' ? '#999' : '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: theme === 'dark' ? '#fff' : '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#007AFF',
  },
}); 