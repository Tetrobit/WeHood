import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Touchable } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { Href, router } from 'expo-router';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  target?: Href;
  isAccordion?: boolean;
  actions?: Array<{
    id: string;
    title: string;
    icon: string;
    target: Href;
  }>;
};

const services: Service[] = [
  {
    id: '1',
    title: 'Недвижимость',
    description: 'Поиск квартиры или дома',
    icon: 'warehouse',
    color: '#44944A',
    category: 'Помощь',
    isAccordion: true,
    actions: [
      {
        id: '1-1',
        title: 'Снять квартиру',
        icon: 'home-search',
        target: { pathname: '/services/flats' },
      },
      {
        id: '1-2',
        title: 'Просмотренные',
        icon: 'eye',
        target: { pathname: '/services/flats/viewed' },
      },
      {
        id: '1-3',
        title: 'Избранное',
        icon: 'heart',
        target: { pathname: '/services/flats/favorites' },
      },
      {
        id: '1-4',
        title: 'Сдать в аренду',
        icon: 'key-variant',
        target: { pathname: '/services/flats/new' },
      },
      {
        id: '1-5',
        title: 'Мои объявления',
        icon: 'clipboard-list',
        target: { pathname: '/services/flats/my' },
      }
    ]
  },
  {
    id: '10',
    title: 'Организации',
    description: 'Медицинские организации, малый бизнес и другие',
    icon: 'office-building',
    color: '#E91E63',
    category: 'Помощь',
    isAccordion: true,
    actions: [
      {
        id: '10-1',
        title: 'Все организации',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/organizations' },
      },
      {
        id: '10-2',
        title: 'Медицинские',
        icon: 'hospital',
        target: { pathname: '/services/organizations', params: { category: 'Медицинские организации' } },
      },
      {
        id: '10-3',
        title: 'Образование',
        icon: 'school',
        target: { pathname: '/services/organizations', params: { category: 'Образование' } },
      },
      {
        id: '10-4',
        title: 'Спорт и здоровье',
        icon: 'dumbbell',
        target: { pathname: '/services/organizations', params: { category: 'Спорт и здоровье' } },
      },
      {
        id: '10-5',
        title: 'Малый бизнес',
        icon: 'store',
        target: { pathname: '/services/organizations', params: { category: 'Малый бизнес' } },
      }
    ]
  },
  {
    id: '2',
    title: 'Детские секции',
    description: 'Поиск и запись в секции и кружки',
    icon: 'school',
    color: '#9C27B0',
    category: 'Помощь',
    isAccordion: true,
    actions: [
      {
        id: '2-1',
        title: 'Найти секцию',
        icon: 'magnify',
        target: { pathname: '/services/activities' },
      },
      {
        id: '2-2',
        title: 'Мои заявки',
        icon: 'clipboard-list',
        target: { pathname: '/services/activities/my' },
      }
    ]
  },
  {
    id: '3',
    title: 'Барахолка',
    description: 'Покупка, продажа и обмен вещами',
    icon: 'tshirt-crew',
    color: '#FF9800',
    category: 'Объявления',
    isAccordion: true,
    actions: [
      {
        id: '3-1',
        title: 'Все объявления',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/flea-market' },
      },
      {
        id: '3-2',
        title: 'Мои объявления',
        icon: 'account',
        target: { pathname: '/services/flea-market/my' },
      },
      {
        id: '3-3',
        title: 'Добавить объявление',
        icon: 'plus-circle',
        target: { pathname: '/services/flea-market/new' },
      },
    ],
  },
  {
    id: '4',
    title: 'Объявления',
    description: 'Городские мероприятия и новости',
    icon: 'bullhorn',
    color: '#007AFF',
    category: 'Объявления',
    isAccordion: false,
    target: { pathname: '/services/events/events' },
  },
  {
    id: '5',
    title: 'События',
    description: 'Городские события и встречи',
    icon: 'calendar-star',
    color: '#4ECDC4',
    category: 'События',
    isAccordion: true,
    actions: [
      {
        id: '5-1',
        title: 'Все события',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/events-city/events' },
      },
      {
        id: '5-2',
        title: 'Мои события',
        icon: 'account',
        target: { pathname: '/services/events-city/my' },
      },
      {
        id: '5-3',
        title: 'Добавить событие',
        icon: 'plus-circle',
        target: { pathname: '/services/events-city/new' },
      },
    ],
  },
  {
    id: '6',
    title: 'Помощь',
    description: 'Запросить или предложить помощь',
    icon: 'hand-heart',
    color: '#FF6B6B',
    category: 'Помощь',
    isAccordion: true,
    actions: [
      {
        id: '6-1',
        title: 'Все заявки',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/help/events' },
      },
      {
        id: '6-2',
        title: 'Мои заявки',
        icon: 'account',
        target: { pathname: '/services/help/my' },
      },
      {
        id: '6-3',
        title: 'Добавить заявку',
        icon: 'plus-circle',
        target: { pathname: '/services/help/new' },
      },
    ],
  },
  {
    id: '7',
    title: 'Местные службы',
    description: 'Сантехники, электрики, ремонт и другие услуги',
    icon: 'account-wrench',
    color: '#00B894',
    category: 'Объявления',
    isAccordion: true,
    actions: [
      {
        id: '7-1',
        title: 'Все службы',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/local-services' },
      },
      {
        id: '7-2',
        title: 'Мои услуги',
        icon: 'account',
        target: { pathname: '/services/local-services/my' },
      },
      {
        id: '7-3',
        title: 'Добавить услугу',
        icon: 'plus-circle',
        target: { pathname: '/services/local-services/new' },
      },
    ],
  },
  {
    id: '8',
    title: 'Голосования',
    description: 'Создавайте голосования и участвуйте в них',
    icon: 'vote',
    color: '#6A1B9A',
    category: 'События',
    isAccordion: true,
    actions: [
      {
        id: '8-1',
        title: 'Все голосования',
        icon: 'format-list-bulleted',
        target: { pathname: '/services/voting' },
      },
      {
        id: '8-2',
        title: 'Создать голосование',
        icon: 'plus-circle',
        target: { pathname: '/services/voting/new' },
      },
      {
        id: '8-3',
        title: 'Мои голосования',
        icon: 'account',
        target: { pathname: '/services/voting/my' },
      }
    ]
  },
  {
    id: '9',
    title: 'Соседи',
    description: 'Чаты и общение с соседями',
    icon: 'account-group',
    color: '#4CAF50',
    category: 'Соседи',
    isAccordion: false,
    target: { pathname: '/services/neighbors/chats' },
  }
];

const categories = ['Все', 'Помощь', 'События', 'Объявления', 'Соседи'];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const handleServicePress = (service: Service) => {
    if (service.isAccordion) {
      setExpandedService(expandedService === service.id ? null : service.id);
    } else if (service.target) {
      router.push(service.target);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Сервисы</Text>
        <Searchbar
          iconColor={theme === 'dark' ? '#fff' : '#000'}
          cursorColor={theme === 'dark' ? '#fff' : '#000'}
          placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          inputStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
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
          <View key={service.id}>
            <Card style={styles.serviceCard}>
              <Card.Content style={styles.serviceContent}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => handleServicePress(service)}
                >
                  <View style={styles.serviceHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
                      <MaterialCommunityIcons name={service.icon as any} size={24} color="#fff" />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={service.isAccordion ? (expandedService === service.id ? "chevron-up" : "chevron-down") : "chevron-right"} 
                      size={24} 
                      color="#666" 
                    />
                  </View>
                </TouchableOpacity>
                {service.isAccordion && expandedService === service.id && service.actions && (
                  <View style={styles.actionsContainer}>
                    {service.actions.map((action, index) => (
                      <TouchableOpacity
                        key={action.id}
                        activeOpacity={0.7}
                        style={{...styles.actionButton, ...(index == service.actions!.length - 1 ? {borderBottomWidth: 0} : {})}}
                        onPress={() => router.push(action.target)}
                      >
                        <MaterialCommunityIcons name={action.icon as any} size={24} color='#888' />
                        <Text style={styles.actionText}>{action.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    color: theme === 'dark' ? '#fff' : '#000',
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
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  serviceHeader: {
    flexDirection: 'row',
  },
  serviceContent: {
    flexDirection: 'column',
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
    color: theme === 'dark' ? '#fff' : '#000',
  },
  serviceDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  actionsContainer: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
});