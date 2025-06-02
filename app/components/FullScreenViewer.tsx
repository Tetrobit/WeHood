import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeName, DARK_THEME } from '@/core/hooks/useTheme';
import { NearbyPost } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoView } from './AutoVideoPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import useApi from '@/core/hooks/useApi';

const { width, height } = Dimensions.get('window');

interface FullScreenViewerProps {
  posts: NearbyPost[];
  initialIndex: number;
  onClose: () => void;
  onUpdatePost: (post: NearbyPost) => void;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ posts, initialIndex, onClose, onUpdatePost }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const theme = useThemeName();
  const styles = makeStyles(theme!);
  const api = useApi();
  
  const translateX = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) > 500) {
        const direction = event.velocityX > 0 ? -1 : 1;
        if (currentIndex + direction >= 0 && currentIndex + direction < posts.length) {
          setCurrentIndex(currentIndex + direction);
        }
      }
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const currentPost = posts[currentIndex];

  const handleLike = async () => {
    try {
      await api.likePost(currentPost.id);
      const updatedPost = {
        ...currentPost,
        likes: currentPost.likes + 1
      };
      onUpdatePost(updatedPost);
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await api.dislikePost(currentPost.id);
      const updatedPost = {
        ...currentPost,
        dislikes: currentPost.dislikes + 1
      };
      onUpdatePost(updatedPost);
    } catch (error) {
      console.error('Ошибка при дизлайке:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.content, animatedStyle]}>
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
              <TouchableOpacity style={styles.statItem} onPress={handleDislike}>
                <MaterialIcons name="thumb-down" size={24} color="#fff" />
                <Text style={styles.statText}>{currentPost.dislikes || 0}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>Комментарии</Text>
              {/* Здесь будет список комментариев */}
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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