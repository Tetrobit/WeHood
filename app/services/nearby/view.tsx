import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Animated as RNAnimated, RefreshControl, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { NearbyPost } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoPlayer } from '@/app/components/AutoVideoPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import useApi from '@/core/hooks/useApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, Realm } from '@realm/react';
import { NearbyPostModel } from '@/core/models/NearbyPostModel';
import { CommentModel } from '@/core/models/CommentModel';
import { Comment } from '@/app/components/Comment';
import { UserAvatar } from '@/app/components/UserAvatar';
import LottieView from 'lottie-react-native';
import { AnimatedText } from '@/app/components/AnimatedText';
import ToastManager, { Toast } from 'toastify-react-native';

const { width, height } = Dimensions.get('window');

export default function ViewPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [theme] = useTheme();
  const styles = makeStyles(theme!);
  const api = useApi();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const slideAnim = React.useRef(new RNAnimated.Value(height)).current;
  const opacityAnim = React.useRef(new RNAnimated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const likeScale = React.useRef(new RNAnimated.Value(1)).current;
  const [isLiked, setIsLiked] = useState(false);
  const [showCensorshipError, setShowCensorshipError] = useState(false);
  const [censorshipError, setCensorshipError] = useState<{ reason?: string; toxicity_score?: number }>({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  const post = useQuery(NearbyPostModel).filtered('id = $0', parseInt(id))[0];
  const comments = useQuery(CommentModel).filtered('deleted == false').filtered('postId = $0', parseInt(id)).sorted('createdAt', true);
  const [currentPost, setCurrentPost] = useState<NearbyPostModel>(post);

  const incrementViews = async () => {
    const response = await api.incerementViews(currentPost.id);
    setCurrentPost({
      ...currentPost,
      views: response.views,
      liked: response.liked,
      likes: response.likes
    } as NearbyPostModel);
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
      slideAnim.setValue(height);
      setShowComments(true);
      setTimeout(() => {
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        RNAnimated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 50);
    } else {
      RNAnimated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowComments(false);
      });
      RNAnimated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
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
      if (!response?.ok) {
        setCensorshipError({
          reason: response?.reason,
          toxicity_score: response?.toxicity_score
        });
        setShowCensorshipError(true);
        return;
      }
      Toast.success('Комментарий успешно отправлен');
      setNewComment('');
    } catch (error) {
      Toast.error("Что-то пошло не так");
      console.error('Ошибка при отправке комментария:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      Alert.alert('Удаление комментария', 'Вы уверены, что хотите удалить этот комментарий?', [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await api.deleteComment(commentId);
              Toast.success('Комментарий удалён');
            } catch (error) {
              Toast.error("Не удалось удалить комментарий");
              console.error('Ошибка при удалении комментария:', error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]);
    } catch (error) {
      Toast.error("Не удалось удалить комментарий");
      console.error('Ошибка при удалении комментария:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSummarizeComments = async () => {
    if (comments.length === 0) return;
    try {
      setIsSummarizing(true);
      const response = await api.summarizeComments(currentPost.id);
      if (!response.ok) {
        Toast.error("Не удалось получить суммаризацию");
        return;
      }
      setSummary(response.summary || 'Не удалось получить суммаризацию');
      setShowSummary(true);
    } catch (error) {
      Toast.error("Не удалось получить суммаризацию");
      console.error('Ошибка при получении суммаризации:', error);
    } finally {
      setIsSummarizing(false);
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
        <View style={styles.mediaContainer}>
          <View style={styles.mediaWrapper}>
            {currentPost.type === 'image' ? (
              <Image
                source={{ uri: getFileUrl(currentPost.fileId) }} 
                style={styles.media}
                contentFit="contain"
              />
            ) : (
              <AutoVideoPlayer 
                source={getFileUrl(currentPost.fileId)} 
                style={styles.media}
              />
            )}
          </View>
        </View>

        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <View style={styles.topBarUp}>
              <TouchableOpacity 
                style={styles.authorContainer}
                onPress={() => {
                  router.push({
                    pathname: "/services/profile/[id]",
                    params: { id: currentPost.authorId }
                  });
                }}
              >
                <UserAvatar
                  firstName={currentPost.authorFirstName}
                  lastName={currentPost.authorLastName}
                  avatar={currentPost.authorAvatar}
                  size={40}
                />
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
                <MaterialIcons name="close" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            <View style={styles.topBarDown}>
              {
                currentPost.address && (
                  <View style={styles.addressContainer}>
                    <MaterialIcons name="location-on" size={16} color={theme === 'dark' ? '#ccc' : '#555'} />
                    <View style={styles.addressTextContainer}>
                      <AnimatedText
                        style={styles.address}
                        text={currentPost.address}
                      />
                    </View>
                  </View>
                )
              }
            </View>
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
            statusBarTranslucent
          >
            <View 
              style={[
                styles.modalOverlay,
                { opacity: showComments ? 1 : 0 }
              ]} 
            >
              <RNAnimated.View 
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                    width: Dimensions.get('window').width,
                  }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.commentsTitle}>Комментарии</Text>
                  <View style={styles.modalHeaderButtons}>
                    {comments.length > 0 && (
                      <TouchableOpacity 
                        style={styles.summarizeButton} 
                        onPress={handleSummarizeComments}
                        disabled={isSummarizing}
                      >
                        {isSummarizing ? (
                          <ActivityIndicator size="small" color={theme === 'dark' ? "#fff" : "#000"} />
                        ) : (
                          <MaterialIcons 
                            name="support-agent" 
                            size={24}
                            color={theme === 'dark' ? '#fff' : '#000'} 
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={toggleComments} style={styles.closeModalButton}>
                      <MaterialIcons name="close" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                  </View>
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
                      <Comment
                        key={comment.id}
                        author={{
                          firstName: comment.authorFirstName,
                          lastName: comment.authorLastName,
                          avatar: comment.authorAvatar
                        }}
                        text={comment.text}
                        createdAt={comment.createdAt.toISOString()}
                        isAuthor={comment.authorId === currentPost.authorId}
                        onDelete={() => handleDeleteComment(comment.id)}
                      />
                    ))
                  ) : (
                    <View style={styles.noCommentsContainer}>
                      <Text style={styles.noCommentsText}>Пока нет комментариев</Text>
                      <LottieView
                        source={require('@/assets/lottie/comments.json')}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                      />
                    </View>
                  )}
                </ScrollView>

                <KeyboardAvoidingView 
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.commentInputContainer}
                >
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Написать комментарий..."
                    placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]} 
                    onPress={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color={theme === 'dark' ? "#fff" : "#000"} />
                    ) : (
                      <MaterialIcons 
                        name="send" 
                        size={24} 
                        color={theme === 'dark' ? "#fff" : "#000"}
                        style={{ opacity: newComment.trim() ? 1 : 0.5 }}
                      />
                    )}
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </RNAnimated.View>
            </View>
          </Modal>
        </View>
      </View>

      <Modal
        visible={showCensorshipError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCensorshipError(false)}
      >
        <View style={[styles.modalOverlay, styles.centeredModal]}>
          <View style={styles.censorshipErrorContainer}>
            <Text style={styles.censorshipErrorTitle}>Комментарий не прошёл проверку</Text>
            {censorshipError.reason && (
              <Text style={styles.censorshipErrorReason}>{censorshipError.reason}</Text>
            )}
            {censorshipError.toxicity_score !== undefined && (
              <Text style={styles.censorshipErrorScore}>
                Уровень токсичности: {(censorshipError.toxicity_score * 100).toFixed(1)}%
              </Text>
            )}
            <TouchableOpacity 
              style={styles.censorshipErrorButton}
              onPress={() => setShowCensorshipError(false)}
            >
              <Text style={styles.censorshipErrorButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSummary}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSummary(false)}
      >
        <View style={[styles.modalOverlay, styles.centeredModal]}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Суммаризация комментариев</Text>
            <Text style={styles.summaryText}>{summary}</Text>
            <TouchableOpacity 
              style={styles.summaryButton}
              onPress={() => setShowSummary(false)}
            >
              <Text style={styles.summaryButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ToastManager />
    </GestureHandlerRootView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
    zIndex: 1,
    flexDirection: 'column',
  },
  topBarUp: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarDown: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  postDate: {
    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  sideStatsContainer: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -100 }],
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#0006',
    paddingLeft: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
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
  centeredModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
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
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
    marginBottom: 5,
  },
  noCommentsText: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    color: theme === 'dark' ? '#fff' : '#000',
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
    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
  },
  title: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 10,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 4,
    height: 20,
    overflow: 'hidden',
  },
  address: {
    color: theme === 'dark' ? '#ccc' : '#555',
    fontSize: 14,
    opacity: 0.9,
    flex: 1,
  },
  description: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 14,
    opacity: 0.9,
  },
  likedText: {
    color: "#FF4081",
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  mediaContainer: {
    height: '100%',
    width: '100%',
  },
  mediaWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  censorshipErrorContainer: {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  censorshipErrorTitle: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  censorshipErrorReason: {
    color: theme === 'dark' ? '#ccc' : '#666',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  censorshipErrorScore: {
    color: '#FF4081',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  censorshipErrorButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  censorshipErrorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summarizeButton: {
    padding: 8,
  },
  summaryContainer: {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  summaryTitle: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryText: {
    color: theme === 'dark' ? '#ccc' : '#666',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  summaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
