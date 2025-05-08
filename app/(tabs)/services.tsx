import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
};

const services: Service[] = [
  {
    id: '1',
    title: 'Помощь пожилым',
    description: 'Волонтерская помощь пожилым людям',
    icon: 'hand-heart',
    color: '#FF6B6B',
    category: 'Помощь'
  },
  {
    id: '2',
    title: 'Уборка территории',
    description: 'Субботники и экологические акции',
    icon: 'broom',
    color: '#4ECDC4',
    category: 'События'
  },
  {
    id: '3',
    title: 'Обмен вещами',
    description: 'Отдайте ненужные вещи нуждающимся',
    icon: 'swap-horizontal',
    color: '#FFD93D',
    category: 'Объявления'
  },
  {
    id: '4',
    title: 'Соседский чат',
    description: 'Общение с соседями',
    icon: 'chat',
    color: '#95E1D3',
    category: 'Соседи'
  },
  {
    id: '5',
    title: 'Доставка продуктов',
    description: 'Помощь с доставкой продуктов',
    icon: 'cart',
    color: '#FF6B6B',
    category: 'Помощь'
  },
  {
    id: '6',
    title: 'Ремонт техники',
    description: 'Помощь с ремонтом бытовой техники',
    icon: 'tools',
    color: '#4ECDC4',
    category: 'Помощь'
  }
];

const categories = ['Все', 'Помощь', 'События', 'Объявления', 'Соседи'];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Сервисы</Text>
        <Searchbar
          placeholder="Поиск сервисов"
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

      <ScrollView style={styles.servicesContainer}>
        {filteredServices.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Content style={styles.serviceContent}>
              <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
                <MaterialCommunityIcons name={service.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
            </Card.Content>
          </Card>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  categoriesScroll: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  servicesContainer: {
    flex: 1,
    padding: 16,
  },
  bottomSpacer: {
    height: 20,
  },
  serviceCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 