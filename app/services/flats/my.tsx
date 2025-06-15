import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Modal } from 'react-native';
import { Card, ProgressBar, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useRef } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';

type FlatListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  description?: string;
  publishedAt: string;
  expiresAt: string;
  views: number;
  favorites: number;
  contacts: number;
  viewsHistory: number[];
  recommendations: string[];
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  area?: number;
  hasParking?: boolean;
  hasFurniture?: boolean;
  hasAppliances?: boolean;
  petsAllowed?: boolean;
  utilities?: string;
  deposit?: number;
  contactPhone?: string;
  contactName?: string;
};

const mockListings: FlatListing[] = [
  {
    id: '1',
    title: '2-комнатная квартира',
    price: 25000,
    address: 'ул. Ленина, 42',
    publishedAt: '2024-03-01',
    expiresAt: '2025-06-01',
    views: 156,
    favorites: 12,
    contacts: 8,
    viewsHistory: [10, 25, 45, 30, 20, 15, 11],
    recommendations: [
      'Добавьте больше фотографий',
      'Укажите подробное описание ремонта',
      'Опишите инфраструктуру района'
    ]
  },
  {
    id: '2',
    title: 'Студия с панорамными окнами',
    price: 18000,
    address: 'ул. Пушкина, 15',
    publishedAt: '2024-03-10',
    expiresAt: '2025-07-10',
    views: 234,
    favorites: 28,
    contacts: 15,
    viewsHistory: [35, 42, 38, 45, 32, 25, 17],
    recommendations: [
      'Добавьте видео-обзор квартиры',
      'Укажите условия заселения с питомцами',
      'Добавьте фото вида из окна'
    ]
  },
  {
    id: '3',
    title: '3-комнатная с ремонтом',
    price: 45000,
    address: 'пр. Мира, 78',
    publishedAt: '2024-02-25',
    expiresAt: '2025-06-25',
    views: 89,
    favorites: 7,
    contacts: 3,
    viewsHistory: [15, 18, 12, 14, 10, 12, 8],
    recommendations: [
      'Снизьте цену - она выше средней по району',
      'Добавьте планировку квартиры',
      'Опишите преимущества района'
    ]
  },
  {
    id: '4',
    title: 'Уютная 1-комнатная',
    price: 20000,
    address: 'ул. Гагарина, 23',
    publishedAt: '2024-03-15',
    expiresAt: '2025-08-15',
    views: 167,
    favorites: 19,
    contacts: 11,
    viewsHistory: [28, 35, 30, 25, 22, 15, 12],
    recommendations: [
      'Добавьте фото мебели и техники',
      'Укажите список доступной бытовой техники',
      'Опишите условия длительной аренды'
    ]
  }
];

export default function MyListingsScreen() {
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<FlatListing | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const rotationAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  // Инициализация анимации для каждого листинга
  mockListings.forEach(listing => {
    if (!rotationAnimations[listing.id]) {
      rotationAnimations[listing.id] = new Animated.Value(0);
    }
  });

  const handleExpand = (listingId: string) => {
    const toValue = expandedListing === listingId ? 0 : 1;
    
    Animated.spring(rotationAnimations[listingId], {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();

    setExpandedListing(expandedListing === listingId ? null : listingId);
  };

  const getRemainingDays = (expiresAt: string) => {
    const now = new Date();
    const expDate = new Date(expiresAt);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEngagementRate = (listing: FlatListing) => {
    return ((listing.contacts + listing.favorites) / listing.views * 100).toFixed(1);
  };

  const handleEdit = (listing: FlatListing) => {
    setEditingListing({ ...listing });
    setShowEditModal(true);
    generateAiSuggestions();
  };

  const handleSave = () => {
    if (!editingListing) return;
    
    // В реальном приложении здесь был бы API-запрос
    const updatedListings = mockListings.map(listing => 
      listing.id === editingListing.id ? editingListing : listing
    );
    
    setShowEditModal(false);
    setEditingListing(null);
  };

  const generateAiSuggestions = () => {
    setIsLoadingAiSuggestions(true);
    // В реальном приложении здесь был бы запрос к AI API
    setTimeout(() => {
      const suggestions = [
        'Добавьте информацию о близлежащих школах и детских садах',
        'Упомяните наличие парковочных мест',
        'Расскажите о качестве интернет-подключения',
        'Добавьте фотографии в разное время суток',
        'Укажите информацию о коммунальных платежах'
      ];
      setAiSuggestions(suggestions);
      setIsLoadingAiSuggestions(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Мои объявления</Text>
            <Text style={styles.subtitle}>Активные публикации: {mockListings.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.listingsContainer}>
        {mockListings.map((listing) => (
          <Card 
            key={listing.id} 
            style={styles.listingCard}
          >
            <Card.Content>
              <TouchableOpacity onPress={() => handleExpand(listing.id)}>
                <View style={styles.listingHeader}>
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{listing.title}</Text>
                    <Text style={styles.listingPrice}>{listing.price.toLocaleString()} ₽/мес</Text>
                    <Text style={styles.listingAddress}>{listing.address}</Text>
                  </View>
                  <View style={styles.listingStats}>
                    <Text style={{...styles.expiryText, color: 'orange'}}>
                      {getRemainingDays(listing.expiresAt)} дней до снятия
                    </Text>
                    <View style={styles.statsRow}>
                      <MaterialCommunityIcons name="eye" size={16} color="#666" />
                      <Text style={styles.statsText}>{listing.views}</Text>
                      <Animated.View style={{
                        marginLeft: 8,
                        transform: [{
                          rotate: rotationAnimations[listing.id].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg']
                          })
                        }]
                      }}>
                        <MaterialCommunityIcons 
                          name="chevron-down" 
                          size={20} 
                          color={theme === 'dark' ? '#fff' : '#666'} 
                        />
                      </Animated.View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedListing === listing.id && (
                <View style={styles.analytics}>
                  <Text style={styles.analyticsTitle}>Аналитика объявления</Text>
                  
                  <View style={styles.metricsContainer}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{listing.views}</Text>
                      <Text style={styles.metricLabel}>Просмотров</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{listing.favorites}</Text>
                      <Text style={styles.metricLabel}>В избранном</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{listing.contacts}</Text>
                      <Text style={styles.metricLabel}>Контактов</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{getEngagementRate(listing)}%</Text>
                      <Text style={styles.metricLabel}>Вовлеченность</Text>
                    </View>
                  </View>

                  <Text style={styles.chartTitle}>Динамика просмотров</Text>
                  <LineChart
                    data={{
                      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                      datasets: [{
                        data: listing.viewsHistory
                      }]
                    }}
                    width={Dimensions.get('window').width - 64}
                    height={180}
                    chartConfig={{
                      backgroundColor: theme === 'dark' ? '#222' : '#fff',
                      backgroundGradientFrom: theme === 'dark' ? '#222' : '#fff',
                      backgroundGradientTo: theme === 'dark' ? '#222' : '#fff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(68, 148, 74, ${opacity})`,
                      style: {
                        borderRadius: 16
                      }
                    }}
                    style={styles.chart}
                    bezier
                  />

                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>Рекомендации</Text>
                    {listing.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#FFD700" />
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionButtons}>
                    <Button 
                      mode="contained" 
                      onPress={() => handleEdit(listing)}
                      style={styles.editButton}
                    >
                      Редактировать
                    </Button>
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Редактирование объявления</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          {editingListing && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Основная информация</Text>
                <Text style={styles.inputLabel}>Название</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.title}
                  onChangeText={(text) => setEditingListing({...editingListing, title: text})}
                  placeholder="Например: Уютная 2-комнатная квартира в центре"
                />

                <Text style={styles.inputLabel}>Цена (₽/мес)</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.price.toString()}
                  onChangeText={(text) => setEditingListing({...editingListing, price: parseInt(text) || 0})}
                  keyboardType="numeric"
                  placeholder="30000"
                />

                <Text style={styles.inputLabel}>Залог (₽)</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.deposit?.toString()}
                  onChangeText={(text) => setEditingListing({...editingListing, deposit: parseInt(text) || 0})}
                  keyboardType="numeric"
                  placeholder="30000"
                />

                <Text style={styles.inputLabel}>Адрес</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.address}
                  onChangeText={(text) => setEditingListing({...editingListing, address: text})}
                  placeholder="Улица, дом"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Характеристики квартиры</Text>
                <Text style={styles.inputLabel}>Количество комнат</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.rooms?.toString()}
                  onChangeText={(text) => setEditingListing({...editingListing, rooms: parseInt(text) || 0})}
                  keyboardType="numeric"
                  placeholder="2"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Этаж</Text>
                    <TextInput
                      style={styles.input}
                      value={editingListing.floor?.toString()}
                      onChangeText={(text) => setEditingListing({...editingListing, floor: parseInt(text) || 0})}
                      keyboardType="numeric"
                      placeholder="5"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Этажей в доме</Text>
                    <TextInput
                      style={styles.input}
                      value={editingListing.totalFloors?.toString()}
                      onChangeText={(text) => setEditingListing({...editingListing, totalFloors: parseInt(text) || 0})}
                      keyboardType="numeric"
                      placeholder="9"
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Площадь (м²)</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.area?.toString()}
                  onChangeText={(text) => setEditingListing({...editingListing, area: parseFloat(text) || 0})}
                  keyboardType="numeric"
                  placeholder="50"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Удобства</Text>
                <View style={styles.checkboxGroup}>
                  <TouchableOpacity 
                    style={styles.checkbox} 
                    onPress={() => setEditingListing({
                      ...editingListing, 
                      hasParking: !editingListing.hasParking
                    })}
                  >
                    <MaterialCommunityIcons 
                      name={editingListing.hasParking ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={24} 
                      color={theme === 'dark' ? '#fff' : '#000'} 
                    />
                    <Text style={styles.checkboxLabel}>Парковка</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkbox} 
                    onPress={() => setEditingListing({
                      ...editingListing, 
                      hasFurniture: !editingListing.hasFurniture
                    })}
                  >
                    <MaterialCommunityIcons 
                      name={editingListing.hasFurniture ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={24} 
                      color={theme === 'dark' ? '#fff' : '#000'} 
                    />
                    <Text style={styles.checkboxLabel}>Мебель</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkbox} 
                    onPress={() => setEditingListing({
                      ...editingListing, 
                      hasAppliances: !editingListing.hasAppliances
                    })}
                  >
                    <MaterialCommunityIcons 
                      name={editingListing.hasAppliances ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={24} 
                      color={theme === 'dark' ? '#fff' : '#000'} 
                    />
                    <Text style={styles.checkboxLabel}>Бытовая техника</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkbox} 
                    onPress={() => setEditingListing({
                      ...editingListing, 
                      petsAllowed: !editingListing.petsAllowed
                    })}
                  >
                    <MaterialCommunityIcons 
                      name={editingListing.petsAllowed ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={24} 
                      color={theme === 'dark' ? '#fff' : '#000'} 
                    />
                    <Text style={styles.checkboxLabel}>Можно с животными</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editingListing.description}
                  onChangeText={(text) => setEditingListing({...editingListing, description: text})}
                  multiline
                  numberOfLines={4}
                  placeholder="Подробное описание квартиры, условия аренды и т.д."
                />

                <Text style={styles.inputLabel}>Коммунальные платежи</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.utilities}
                  onChangeText={(text) => setEditingListing({...editingListing, utilities: text})}
                  placeholder="Например: Включены в стоимость / Оплачиваются отдельно"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Контактная информация</Text>
                <Text style={styles.inputLabel}>Имя</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.contactName}
                  onChangeText={(text) => setEditingListing({...editingListing, contactName: text})}
                  placeholder="Как к вам обращаться"
                />

                <Text style={styles.inputLabel}>Телефон</Text>
                <TextInput
                  style={styles.input}
                  value={editingListing.contactPhone}
                  onChangeText={(text) => setEditingListing({...editingListing, contactPhone: text})}
                  keyboardType="phone-pad"
                  placeholder="+7 (___) ___-__-__"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Рекомендации ИИ</Text>
                {isLoadingAiSuggestions ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Генерация рекомендаций...</Text>
                  </View>
                ) : (
                  <View style={styles.aiSuggestionsContainer}>
                    {aiSuggestions.map((suggestion, index) => (
                      <View key={index} style={styles.suggestionItem}>
                        <MaterialCommunityIcons 
                          name="lightbulb-outline" 
                          size={20} 
                          color={theme === 'dark' ? '#44944A' : '#44944A'} 
                        />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </View>
                    ))}
                    <Button 
                      mode="outlined" 
                      onPress={generateAiSuggestions}
                      style={styles.refreshButton}
                    >
                      Обновить рекомендации
                    </Button>
                  </View>
                )}
              </View>

              <Button 
                mode="contained" 
                onPress={handleSave}
                style={styles.saveButton}
              >
                Сохранить
              </Button>

              <View style={styles.bottomPadding} />
            </ScrollView>
          )}
        </View>
      </Modal>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  listingsContainer: {
    padding: 16,
  },
  listingCard: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#44944A',
    marginBottom: 4,
  },
  listingAddress: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  listingStats: {
    alignItems: 'flex-end',
  },
  expiryText: {
    fontSize: 12,
    color: '#44944A',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  analytics: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#333' : '#eee',
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#44944A',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 16,
  },
  chart: {
    marginBottom: 24,
    borderRadius: 16,
  },
  recommendationsContainer: {
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#000',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#44944A',
  },
  aiSuggestionContainer: {
    backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  aiSuggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  aiSuggestionText: {
    fontSize: 14,
    color: theme === 'dark' ? '#ddd' : '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 16,
  },
  aiSuggestionsContainer: {
    backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: theme === 'dark' ? '#ddd' : '#333',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: theme === 'dark' ? '#aaa' : '#666',
    fontSize: 14,
  },
  refreshButton: {
    marginTop: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  bottomPadding: {
    height: 100, // Отступ для нижней навигации Android
  },
}); 