import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useThemeName } from '@/core/hooks/useTheme';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

const demoHelps = [
  {
    id: '1',
    title: 'Нужна помощь с покупками',
    description: 'Пожилой человек, нужна помощь с покупкой продуктов на неделю.',
    image: 'https://media.istockphoto.com/id/1130450531/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C-%D0%B4%D0%B5%D0%B4%D1%83-%D1%81-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8.jpg?s=1024x1024&w=is&k=20&c=dGRjj3z78NQjpEjUaHESgC_73AG7I60Wk5knUDZcXQM=',
    price: '500 ₽',
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
  const theme = useThemeName() ?? 'light';
  const styles = makeStyles(theme);

  const handleCall = () => {
    Linking.openURL(`tel:${help.phone.replace(/[^\d+]/g, '')}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {help.image && (
          <Image source={{ uri: help.image }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{help.title}</Text>
          <Text style={styles.price}>{help.price}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{help.description}</Text>
          </View>

          <View style={styles.sectionRow}>
            <MaterialCommunityIcons name="account" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
            <Text style={styles.authorName}>{help.name}</Text>
          </View>

          <View style={styles.sectionRow}>
            <MaterialCommunityIcons name="phone" size={20} color={theme === DARK_THEME ? '#aaa' : '#666'} />
            <Text style={styles.phone}>{help.phone}</Text>
          </View>
          <View style={{flex: 1}} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleCall}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="phone"
        >
          Позвонить организатору
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
    height: 260,
  },
  content: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    flex: 1,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  section: {
    marginBottom: 20,
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
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorName: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  phone: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderTopWidth: 1,
    borderTopColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#FF6B6B',
  },
}); 