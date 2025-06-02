import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeName, DARK_THEME } from '@/core/hooks/useTheme';
import { NearbyPost } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoView } from '@/app/components/AutoVideoPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import useApi from '@/core/hooks/useApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@realm/react';
import { NearbyPostModel } from '@/core/models/nearby-post';

const { width, height } = Dimensions.get('window');

export default function ViewPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useThemeName();
  const styles = makeStyles(theme!);
  const api = useApi();
  
  const post = useQuery(NearbyPostModel).filtered('id = $0', parseInt(id))[0];
  const [currentPost, setCurrentPost] = useState<NearbyPost>(post);

  const handleLike = async () => {
    try {
      await api.likePost(currentPost.id);
      setCurrentPost({
        ...currentPost,
        likes: currentPost.likes + 1
      });
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  if (!post) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Пост не найден</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        {currentPost.type === 'image' ? (
          <Image 
            source={{ uri: getFileUrl(currentPost.fileId) }} 
            style={styles.media}
            resizeMode="contain"
          />
        ) : (
          <AutoVideoView 
            source={getFileUrl(currentPost.fileId)} 
            style={styles.media}
          />
        )}

        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="visibility" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.views || 0}</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={handleLike}>
              <MaterialIcons name="thumb-up" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.likes || 0}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Комментарии</Text>
            {/* Здесь будет список комментариев */}
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  media: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
  },
  commentsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  commentsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
}); 