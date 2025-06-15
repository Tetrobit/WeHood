import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import { useState, useCallback, useEffect } from 'react';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useApi } from '@/core/hooks/useApi';
import { Voting } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import LottieView from 'lottie-react-native';

export default function VotingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const api = useApi();
  const [votings, setVotings] = useState<Voting[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  
  const loadVotings = useCallback(async (isRefreshing = false) => {
    if (loading || (!hasMore && !isRefreshing)) return;

    try {
      setLoading(true);
      const currentOffset = isRefreshing ? 0 : offset;
      const response = await api.getVotings(currentOffset, limit);
      if (!response.votings) {
        return;
      }
      
      if (isRefreshing) {
        setVotings(response.votings);
      } else {
        setVotings(prev => [...prev, ...response.votings]);
      }
      
      setOffset(currentOffset + response.votings.length);
      setHasMore(response.votings.length === limit);
    } catch (error) {
      console.error('Error loading votings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, offset, hasMore, api]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    loadVotings(true);
  }, [loadVotings]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadVotings();
    }
  }, [loading, hasMore, loadVotings]);

  const filteredVotings = votings.filter(voting =>
    voting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voting.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    loadVotings(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Голосования</Text>
      </View>

      <ScrollView 
        style={styles.votingsContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6A1B9A']}
          />
        }
      >
        {filteredVotings.map((voting) => (
          <Card key={voting.id} style={styles.votingCard}>
            <Card.Content>
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/services/voting/[id]',
                  params: {
                    id: voting.id.toString(),
                  },
                })}
              >
                <Image
                  source={{ uri: getFileUrl(voting.image) }}
                  style={styles.votingImage}
                  resizeMode="cover"
                />
                <Text style={styles.votingTitle}>{voting.title}</Text>
                <Text style={styles.votingDescription}>{voting.description}</Text>
                
                <View style={styles.optionsContainer}>
                  {voting.options.map((option, index) => (
                    <View key={index} style={styles.optionItem}>
                      <View style={styles.optionHeader}>
                        <Text style={styles.optionText}>{option.text}</Text>
                        <Text style={styles.votesCount}>{option.votes} голосов</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${(option.votes / voting.options.reduce((acc, option) => acc + option.votes, 0)) * 100}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.votingFooter}>
                  <View style={styles.authorInfo}>
                    <Image
                      source={{ uri: voting.createdBy.avatar || 'https://via.placeholder.com/24' }}
                      style={styles.authorAvatar}
                    />
                    <Text style={styles.authorName}>
                      {voting.createdBy.firstName} {voting.createdBy.lastName}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{new Date(voting.createdAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}

        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6A1B9A" />
          </View>
        )}

        {!hasMore && !loading && votings.length > 0 && (
          <Text style={styles.endText}>Больше голосований нет</Text>
        )}
        
        {!votings.length && (
          <>
            <LottieView
              source={require('@/assets/lottie/empty.json')}
              autoPlay
              loop
              style={{ width: '100%', height: 300 }}
            />
            <Text style={styles.endText}>Нет голосований</Text>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/services/voting/new')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
  },
  votingsContainer: {
    flex: 1,
    padding: 16,
  },
  votingCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  votingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  votingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  votingDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#000',
    flexShrink: 1,
    flex: 1,
  },
  votesCount: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A1B9A',
  },
  votingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  dateText: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  endText: {
    textAlign: 'center',
    color: theme === 'dark' ? '#aaa' : '#666',
    padding: 20,
  },
}); 