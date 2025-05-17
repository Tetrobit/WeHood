import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { Dimensions } from 'react-native';

type FlatListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  publishedAt: string;
  expiresAt: string;
  views: number;
  favorites: number;
  contacts: number;
  viewsHistory: number[];
  recommendations: string[];
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
  // Добавьте больше мок-данных при необходимости
];

export default function MyListingsScreen() {
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const theme = useThemeName();
  const styles = makeStyles(theme);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои объявления</Text>
        <Text style={styles.subtitle}>Активные публикации: {mockListings.length}</Text>
      </View>

      <ScrollView style={styles.listingsContainer}>
        {mockListings.map((listing) => (
          <Card 
            key={listing.id} 
            style={styles.listingCard}
            onPress={() => setExpandedListing(expandedListing === listing.id ? null : listing.id)}
          >
            <Card.Content>
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
                  </View>
                </View>
              </View>

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
                      backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
                      backgroundGradientFrom: theme === DARK_THEME ? '#222' : '#fff',
                      backgroundGradientTo: theme === DARK_THEME ? '#222' : '#fff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
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
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  listingsContainer: {
    padding: 16,
  },
  listingCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
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
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  listingAddress: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  listingStats: {
    alignItems: 'flex-end',
  },
  expiryText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  analytics: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
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
    color: '#007AFF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 16,
  },
  chart: {
    marginBottom: 24,
    borderRadius: 16,
  },
  recommendationsContainer: {
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
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
    color: theme === DARK_THEME ? '#fff' : '#000',
    flex: 1,
  },
}); 