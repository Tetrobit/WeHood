import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DARK_THEME, LIGHT_THEME, useThemeName } from '@/core/hooks/useTheme';
import useGeolocation from '@/core/hooks/useGeolocation';
import { useRouter } from 'expo-router';
import useApi, { NearbyPost } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { calculateFormattedDistance } from '@/core/utils/location';
import { VideoPlayer } from 'expo-video';
import { AutoVideoView } from '../components/AutoVideoPlayer';
import LottieView from 'lottie-react-native';
import { FullScreenViewer } from '../components/FullScreenViewer';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'images', label: 'Картинки' },
  { key: 'shorts', label: 'Shorts' },
  { key: 'my', label: 'Мои публикации' },
];

export default function NearbyScreen() {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const theme = useThemeName();
  const styles = makeStyles(theme!);
  const { lastLocation } = useGeolocation();
  const router = useRouter();
  const api = useApi();
  const [posts, setPosts] = useState<NearbyPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setRefreshing(true);
    if (lastLocation) {
      try {
        const posts = await api.getNearbyPosts(lastLocation.latitude, lastLocation.longitude);
        if (posts && posts?.length >= 0) {
          setPosts(posts);
        }
        else {
          console.error(posts);
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        setRefreshing(false);
      }
    }
  };

  React.useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => {
      fetchPosts();
    }, 1000 * 20);

    return () => clearInterval(interval);
  }, []);

  let filteredPosts: NearbyPost[] = [];
  if (posts?.filter) {
    filteredPosts = posts?.filter(post => {
      if (activeTab === 'images') {
        return post.type == 'image';
      }
      if (activeTab === 'shorts') {
        return post.type == 'video';
      }
      if (activeTab === 'my') {
        return post.author?.id == api.profile?.id;
      }
    });
  }

  const handleUpdatePost = (updatedPost: NearbyPost) => {
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
  };

  return (
    <View style={styles.container}>
      {/* Верхняя панель */}
      <View style={styles.header}>
        <View>
          <Text style={styles.district}>{lastLocation?.district}</Text>
          <Text style={styles.city}>{lastLocation?.locality}</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons 
            name="tune" 
            size={24} 
            color={theme === DARK_THEME ? '#fff' : '#222'} 
          />
        </TouchableOpacity>
      </View>

      {/* Табы */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Сетка картинок */}
      <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />}>
        <View style={styles.grid}>
          {filteredPosts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={[styles.card]}
              onPress={() => router.push(`/services/nearby/view?id=${post.id}`)}
            >
              { post.type === 'image' && (
                <Image source={{ uri: getFileUrl(post.fileId) }} style={styles.image} />
              )}

              { post.type === 'video' && (
                <AutoVideoView source={getFileUrl(post.fileId)} style={styles.image} />
              )}

              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{calculateFormattedDistance(lastLocation.latitude, lastLocation.longitude, post.latitude, post.longitude)}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredPosts.length === 0 && (
            <View style={{ flex: 1, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                source={require('@/assets/lottie/empty.json')}
                autoPlay
                style={{ width: 300, height: 300 }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Кнопка добавления */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add-content')}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Полноэкранный просмотр */}
      {selectedPostIndex !== null && (
        <FullScreenViewer
          posts={filteredPosts}
          initialIndex={selectedPostIndex}
          onClose={() => setSelectedPostIndex(null)}
          onUpdatePost={handleUpdatePost}
        />
      )}
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  district: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  city: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginTop: 2,
  },
  filterBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
  },
  tabActive: {
    backgroundColor: theme === DARK_THEME ? '#555' : '#222',
  },
  tabText: {
    fontSize: 15,
    color: theme === DARK_THEME ? '#fff' : '#222',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  gridScroll: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 80,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 32) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#333' : '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  distanceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});