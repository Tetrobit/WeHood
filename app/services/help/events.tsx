import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

export default function HelpListScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.replace('/services')}
          style={styles.headerIcon}
          iconColor={theme === DARK_THEME ? '#fff' : '#000'}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={styles.title}>Помощь района</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.helpsContainer}>
        {demoHelps.map((help) => (
          <Card key={help.id} style={styles.helpCard} onPress={() => router.push({ pathname: '/services/help/[id]', params: { id: help.id } })}>
            <Image source={{ uri: help.image }} style={styles.helpImage} />
            <Card.Content>
              <Text style={styles.helpTitle}>{help.title}</Text>
              <Text style={styles.helpDescription}>{help.description}</Text>
              <Text style={styles.helpPrice}>Цена: {help.price}</Text>
              <Text style={styles.helpName}>Имя: {help.name}</Text>
              <Text style={styles.helpPhone}>Телефон: {help.phone}</Text>
            </Card.Content>
          </Card>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fabSmall}
        onPress={() => router.push('/services/help/new')}
        accessibilityLabel="Добавить помощь"
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 0,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    textAlign: 'center',
  },
  helpsContainer: {
    flex: 1,
    padding: 16,
  },
  helpCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  helpImage: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  helpDescription: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 4,
  },
  helpPrice: {
    fontSize: 15,
    color: '#FF6B6B',
    marginBottom: 2,
  },
  helpName: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  helpPhone: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 2,
  },
  bottomSpacer: {
    height: 80,
  },
  fabSmall: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
}); 