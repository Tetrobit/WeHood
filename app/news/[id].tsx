import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { useQuery } from '@realm/react';
import UserModel from '@/core/models/UserModel';

const mockNews = [
  {
    id: '1',
    title: 'Субботник в парке',
    description: 'В эту субботу состоится уборка территории парка. Приглашаем всех желающих!',
    time: '2 часа назад',
    image: 'https://img.freepik.com/premium-vector/people-collecting-garbage-city-park-men-women-volunteers-cleaning-park-together-from-trash_461812-205.jpg',
    likes: 12,
    comments: [
      { id: 'c1', author: 'Иван', text: 'Отличная инициатива!' },
      { id: 'c2', author: 'Мария', text: 'Обязательно приду!' },
    ],
  },
  {
    id: '2',
    title: 'Новая детская площадка',
    description: 'В нашем районе открылась современная детская площадка',
    time: '4 часа назад',
    image: 'https://sp-izumrud.ru/wp-content/uploads/2018/08/Sanatorij-Izumrud-19.jpg',
    likes: 8,
    comments: [
      { id: 'c3', author: 'Сергей', text: 'Дети в восторге!' },
    ],
  },
];

const mockAvatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
];
const defaultAvatar = 'https://randomuser.me/api/portraits/lego/1.jpg';

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [theme] = useTheme();
  const isDark = theme === 'dark';
  const styles = makeStyles(theme);
  const news = mockNews.find(n => n.id === id) ?? mockNews[0];
  const [likes, setLikes] = useState(news.likes);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(news.comments);
  const commentsListRef = useRef<FlatList>(null);
  const [user] = useQuery(UserModel);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  // Сохраняем лайки в AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(`news_likes_${news.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikes(parsed.likes);
        setLiked(parsed.liked);
      }
      // Загружаем комментарии
      const commentsStored = await AsyncStorage.getItem(`news_comments_${news.id}`);
      if (commentsStored) {
        try {
          const commentsArr = JSON.parse(commentsStored);
          if (Array.isArray(commentsArr)) setComments(commentsArr);
        } catch {}
      }
      // Загружаем лайки комментариев
      const commentLikesStored = await AsyncStorage.getItem(`comment_likes_${news.id}`);
      if (commentLikesStored) {
        try {
          const likesObj = JSON.parse(commentLikesStored);
          setCommentLikes(likesObj);
        } catch {}
      }
      const likedCommentsStored = await AsyncStorage.getItem(`liked_comments_${news.id}`);
      if (likedCommentsStored) {
        try {
          const likedObj = JSON.parse(likedCommentsStored);
          setLikedComments(likedObj);
        } catch {}
      }
    })();
  }, [news.id]);

  useEffect(() => {
    AsyncStorage.setItem(`news_likes_${news.id}`, JSON.stringify({ likes, liked }));
  }, [likes, liked, news.id]);

  useEffect(() => {
    AsyncStorage.setItem(`comment_likes_${news.id}`, JSON.stringify(commentLikes));
  }, [commentLikes, news.id]);

  useEffect(() => {
    AsyncStorage.setItem(`liked_comments_${news.id}`, JSON.stringify(likedComments));
  }, [likedComments, news.id]);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const handleAddComment = () => {
    if (comment.trim().length > 0) {
      const newComments = [...comments, { id: Date.now().toString(), author: 'Вы', text: comment }];
      setComments(newComments);
      setComment('');
      AsyncStorage.setItem(`news_comments_${news.id}`, JSON.stringify(newComments));
      setTimeout(() => {
        commentsListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleLikeComment = (id: string) => {
    if (likedComments[id]) {
      setCommentLikes(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));
      setLikedComments(prev => ({ ...prev, [id]: false }));
    } else {
      setCommentLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setLikedComments(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <View style={styles.root}>
      {/* Кастомный header со стрелкой */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Новости</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: news.image }} style={styles.image} />
          <Card.Content>
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.description}>{news.description}</Text>
            <Text style={styles.time}>{news.time}</Text>
            <View style={styles.likesRow}>
              <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={22} color="#FF6B6B" />
                <Text style={styles.likesCount}>{likes}</Text>
              </TouchableOpacity>
              <MaterialCommunityIcons name="comment-outline" size={22} color="#00D26A" style={{ marginLeft: 16, marginRight: 4 }} />
              <Text style={styles.commentsCount}>{comments.length}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Список комментариев с аватарками и лайками */}
        {comments.map((item, idx) => (
          <View key={item.id} style={styles.commentItem}>
            {item.author === 'Вы' ? (
              <Image
                source={{ uri: user?.avatar || defaultAvatar }}
                style={styles.commentAvatar}
              />
            ) : (
              <Image
                source={{ uri: mockAvatars[idx % mockAvatars.length] }}
                style={styles.commentAvatar}
              />
            )}
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.commentAuthor}>{item.author}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <View style={styles.commentLikeRow}>
                <TouchableOpacity onPress={() => handleLikeComment(item.id)} style={styles.commentLikeBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name={likedComments[item.id] ? 'heart' : 'heart-outline'} size={22} color="#FF6B6B" style={styles.commentLikeIcon} />
                  <Text style={styles.commentLikeCount}>{commentLikes[item.id] || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Фиксированная нижняя панель для ввода комментария */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={16} style={styles.inputBarWrapper}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputBarInput}
            placeholder="Добавить комментарий..."
            value={comment}
            onChangeText={setComment}
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            multiline={false}
            numberOfLines={1}
            returnKeyType="send"
            onSubmitEditing={handleAddComment}
          />
          <Button mode="contained" onPress={handleAddComment} style={styles.inputBarButton} labelStyle={{ color: '#fff' }}>
            Отправить
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 8,
      paddingHorizontal: 8,
      backgroundColor: isDark ? '#000' : '#fff',
      zIndex: 10,
    },
    backBtn: {
      padding: 4,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#f5f5f5',
    },
    card: {
      margin: 16,
      borderRadius: 16,
      backgroundColor: isDark ? '#222' : '#fff',
      overflow: 'hidden',
    },
    image: {
      height: 200,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginTop: 12,
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      color: isDark ? '#aaa' : '#666',
      marginBottom: 8,
    },
    time: {
      fontSize: 12,
      color: isDark ? '#888' : '#999',
      marginBottom: 8,
    },
    likesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    likesCount: {
      color: '#FF6B6B',
      marginLeft: 4,
      fontSize: 15,
    },
    commentsCount: {
      color: '#00D26A',
      fontSize: 15,
    },
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingLeft: 16,
    },
    commentAuthor: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      fontSize: 17,
    },
    commentText: {
      color: isDark ? '#aaa' : '#666',
      fontSize: 16,
    },
    inputBarWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 16,
      backgroundColor: isDark ? '#000' : '#f5f5f5',
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: isDark ? '#111' : '#f0f0f0',
    },
    inputBarInput: {
      flex: 1,
      backgroundColor: 'transparent',
      color: isDark ? '#fff' : '#000',
      padding: 12,
      fontSize: 14,
    },
    inputBarButton: {
      borderRadius: 8,
      elevation: 0,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    commentLikeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: -4 },
    commentLikeBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 0, alignSelf: 'flex-start' },
    commentLikeIcon: { marginBottom: -2, marginRight: 2 },
    commentLikeCount: { color: '#FF6B6B', marginLeft: 2, fontSize: 15, marginBottom: -2 },
  });
}; 