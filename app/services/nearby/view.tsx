import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Modal, Animated as RNAnimated, RefreshControl, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeName, DARK_THEME } from '@/core/hooks/useTheme';
import { NearbyPost } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoView } from '@/app/components/AutoVideoPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import useApi from '@/core/hooks/useApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, Realm } from '@realm/react';
import { NearbyPostModel } from '@/core/models/nearby-post';
import { CommentModel } from '@/core/models/comment';

const { width, height } = Dimensions.get('window');

export default function ViewPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useThemeName();
  const styles = makeStyles(theme!);
  const api = useApi();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slideAnim = React.useRef(new RNAnimated.Value(height)).current;
  const [refreshing, setRefreshing] = useState(false);
  const likeScale = React.useRef(new RNAnimated.Value(1)).current;
  const [isLiked, setIsLiked] = useState(false);
  
  const post = useQuery(NearbyPostModel).filtered('id = $0', parseInt(id))[0];
  const comments = useQuery(CommentModel).filtered('postId = $0', parseInt(id));
  const [currentPost, setCurrentPost] = useState<NearbyPostModel>(post);

  const incrementViews = async () => {
    const response = await api.incerementViews(currentPost.id);
    setCurrentPost({
      ...currentPost,
      views: response.views,
      liked: response.liked,
      likes: response.likes
    } as NearbyPostModel);
    console.log("CurrentPost: ", currentPost);
  };

  React.useEffect(() => {
    incrementViews();
  }, []);

  const handleLike = async () => {
    try {
      const response = await api.likePost(currentPost.id);
      setCurrentPost({
        ...currentPost,
        views: response.views,
        liked: response.liked,
        likes: response.likes
      } as NearbyPostModel);
      
      // Анимация при лайке
      RNAnimated.sequence([
        RNAnimated.timing(likeScale, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        RNAnimated.timing(likeScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      setIsLiked(response.liked);
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      setShowComments(true);
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowComments(false);
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await api.getComments(currentPost.id);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.addComment(currentPost.id, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error);
    } finally {
      setIsSubmitting(false);
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
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.authorContainer}
              onPress={() => router.push({
                pathname: "/services/profile/[id]",
                params: { id: currentPost.author.id }
              })}
            >
              {currentPost.authorAvatar ? (
                <Image 
                  source={{ uri: currentPost.authorAvatar }} 
                  style={styles.authorAvatar}
                />
              ) : (
                <View style={styles.authorAvatarPlaceholder}>
                  <MaterialIcons name="person" size={24} color="#fff" />
                </View>
              )}
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {`${currentPost.authorFirstName} ${currentPost.authorLastName}`}
                </Text>
                <Text style={styles.postDate}>
                  {new Date(currentPost.createdAt).toLocaleDateString('ru-RU')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.sideStatsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="visibility" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.views || 0}</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={handleLike}>
              <RNAnimated.View style={{ transform: [{ scale: likeScale }] }}>
                <MaterialIcons 
                  name="thumb-up" 
                  size={24} 
                  color={currentPost.liked ? "#FF4081" : "#fff"} 
                />
              </RNAnimated.View>
              <Text style={[styles.statText, currentPost.liked && styles.likedText]}>
                {currentPost.likes || 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={toggleComments}>
              <MaterialIcons name="chat-bubble" size={24} color="#fff" />
              <Text style={styles.statText}>{comments.length || 0}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.title}>{currentPost.title || 'Без названия'}</Text>
            <Text style={styles.description}>{currentPost.description || 'Нет описания'}</Text>
          </View>

          <Modal
            visible={showComments}
            transparent
            animationType="none"
            onRequestClose={toggleComments}
          >
            <View 
              style={styles.modalOverlay} 
            >
              <RNAnimated.View 
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.commentsTitle}>Комментарии</Text>
                  <TouchableOpacity onPress={toggleComments} style={styles.closeModalButton}>
                    <MaterialIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.commentsList}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#fff"
                    />
                  }
                >
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <Text style={styles.commentText}>{comment.text}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noCommentsText}>Пока нет комментариев</Text>
                  )}
                </ScrollView>

                <KeyboardAvoidingView 
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.commentInputContainer}
                >
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Написать комментарий..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]} 
                    onPress={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    <MaterialIcons 
                      name="send" 
                      size={24} 
                      color={newComment.trim() ? "#fff" : "rgba(255,255,255,0.3)"} 
                    />
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </RNAnimated.View>
            </View>
          </Modal>
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
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  postDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  sideStatsContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -100 }],
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.5,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeModalButton: {
    padding: 8,
  },
  commentsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
    marginBottom: 5,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
  },
  noCommentsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    maxHeight: 60,
    paddingVertical: 6,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  likedText: {
    color: "#FF4081",
  },
}); 