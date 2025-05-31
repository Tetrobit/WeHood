import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeName } from '@/core/hooks/useTheme';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';

const demoHelps = [
  {
    id: '1',
    title: 'Нужна помощь с покупками',
    description: 'Пожилой человек, нужна помощь с покупкой продуктов на неделю.',
    image: 'https://media.istockphoto.com/id/1130450531/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C-%D0%B4%D0%B5%D0%B4%D1%83-%D1%81-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8.jpg?s=1024x1024&w=is&k=20&c=dGRjj3z78NQjpEjUaHESgC_73AG7I60Wk5knUDZcXQM=',
    price: '500',
    name: 'Анна Сергеевна',
    phone: '+7 (999) 111-22-33',
  },
  {
    id: '2',
    title: 'Помогу с ремонтом',
    description: 'Могу помочь с мелким ремонтом по дому. Инструменты есть.',
    image: 'https://1000remontov.ru/wp-content/uploads/2018/04/3-1.jpg',
    price: 'Договорная',
    name: 'Виктор',
    phone: '+7 (999) 222-33-44',
  },
];

export default function HelpDetailsScreen() {
  const { id } = useLocalSearchParams();
  const help = demoHelps.find(e => e.id === id) || demoHelps[0];
  const theme = useThemeName();
  const styles = makeStyles(theme);

  const handleCall = () => {
    Linking.openURL(`tel:${help.phone.replace(/[^\d+]/g, '')}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: help.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/services/help/events')} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme === DARK_THEME ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{help.title}</Text>
        <Text style={styles.description}>{help.description}</Text>
        <Text style={styles.price}>Цена: {help.price}</Text>
        <Text style={styles.name}>Имя: {help.name}</Text>
        <Text style={styles.phone}>Телефон: {help.phone}</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
          <Text style={styles.contactButtonText}>Связаться с организатором</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#111' : '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 0,
  },
  content: {
    padding: 20,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -24,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#222',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 2,
  },
  phone: {
    fontSize: 15,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 12,
  },
  contactButton: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  contactButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
}); 