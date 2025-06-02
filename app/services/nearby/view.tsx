import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Modal, Animated as RNAnimated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeName, DARK_THEME } from '@/core/hooks/useTheme';
import { NearbyPost, Comment } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoView } from '@/app/components/AutoVideoPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
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
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slideAnim = React.useRef(new RNAnimated.Value(height)).current;
  
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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.addComment(currentPost.id, newComment.trim());
      
      setCurrentPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response]
      }));
      
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
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.sideStatsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="visibility" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.views || 0}</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={handleLike}>
              <MaterialIcons name="thumb-up" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={toggleComments}>
              <MaterialIcons name="chat-bubble" size={24} color="#fff" />
              <Text style={styles.statText}>{currentPost.comments?.length || 0}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showComments}
            transparent
            animationType="none"
            onRequestClose={toggleComments}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={toggleComments}
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

                <View style={styles.commentsList}>
                  {currentPost.comments && currentPost.comments.length > 0 ? (
                    currentPost.comments.map((comment, index) => (
                      <View key={index} style={styles.commentItem}>
                        <Text style={styles.commentText}>{comment.text}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noCommentsText}>Пока нет комментариев</Text>
                  )}
                </View>

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
            </TouchableOpacity>
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
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
}); 