import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useThemeName() ?? 'light';
  const styles = makeStyles(theme);

  // Моки услуг, как в index.tsx
  const services = [
    {
      id: '1',
      title: 'Сантехник',
      price: 1200,
      description: 'Устранение протечек, замена смесителей, установка сантехники',
      category: 'Сантехник',
      image: 'https://images.unsplash.com/photo-1503389152951-9c3d029fd6a0?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Павел', rating: 4.8, phone: '+7 (999) 123-45-67' },
      createdAt: '2024-03-20',
    },
    {
      id: '2',
      title: 'Электрик',
      price: 1500,
      description: 'Проводка, розетки, светильники, устранение коротких замыканий',
      category: 'Электрик',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Андрей', rating: 4.7, phone: '+7 (999) 123-45-68' },
      createdAt: '2024-03-19',
    },
    {
      id: '3',
      title: 'Ремонт квартир',
      price: 5000,
      description: 'Косметический и капитальный ремонт, отделка, покраска',
      category: 'Ремонт',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Виктор', rating: 4.9, phone: '+7 (999) 123-45-69' },
      createdAt: '2024-03-18',
    },
    {
      id: '4',
      title: 'Уборка помещений',
      price: 1000,
      description: 'Генеральная и поддерживающая уборка квартир и офисов',
      category: 'Уборка',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Мария', rating: 4.6, phone: '+7 (999) 123-45-70' },
      createdAt: '2024-03-17',
    },
    {
      id: '5',
      title: 'Курьерские услуги',
      price: 500,
      description: 'Доставка документов, покупок, еды по району',
      category: 'Курьер',
      image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Игорь', rating: 4.5, phone: '+7 (999) 123-45-71' },
      createdAt: '2024-03-16',
    },
    {
      id: '6',
      title: 'Репетитор по математике',
      price: 800,
      description: 'Подготовка к экзаменам, помощь с домашними заданиями',
      category: 'Репетитор',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
      author: { name: 'Елена', rating: 4.9, phone: '+7 (999) 123-45-72' },
      createdAt: '2024-03-15',
    },
  ];
  const service = services.find(s => s.id === id) ?? null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {service && service.image && (
          <Image 
            source={{ uri: service.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          {service ? (
            <>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.price}>{service.price} ₽</Text>
              
              <View style={styles.categoryContainer}>
                <MaterialCommunityIcons name="tag" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
                <Text style={styles.category}>{service.category}</Text>
              </View>

              <View style={styles.authorContainer}>
                <MaterialCommunityIcons name="account" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
                <Text style={styles.authorName}>{service.author.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{service.author.rating}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>{service.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Дата публикации</Text>
                <Text style={styles.date}>{new Date(service.createdAt).toLocaleDateString('ru-RU')}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.title}>Услуга не найдена</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {service && service.author && service.author.phone && (
          <Button
            mode="contained"
            onPress={() => Linking.openURL(`tel:${service.author.phone}`)}
            style={styles.button}
            icon="phone"
          >
            Позвонить исполнителю
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
    backgroundColor: '#007AFF',
  },
}); 