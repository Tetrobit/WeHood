import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, useTheme } from '@/core/hooks/useTheme';

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

  // Сохраняем лайки в AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(`news_likes_${news.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikes(parsed.likes);
        setLiked(parsed.liked);
      }
    })();
  }, [news.id]);

  useEffect(() => {
    AsyncStorage.setItem(`news_likes_${news.id}`, JSON.stringify({ likes, liked }));
  }, [likes, liked, news.id]);

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
      setComments(prev => [...prev, { id: Date.now().toString(), author: 'Вы', text: comment }]);
      setComment('');
      setTimeout(() => {
        commentsListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={styles.root}>
      {/* Кастомный header со стрелкой */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новости</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }}>
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
        <View style={styles.commentsBlock}>
          <Text style={styles.commentsTitle}>Комментарии</Text>
          <FlatList
            ref={commentsListRef}
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <MaterialCommunityIcons name="account-circle" size={22} color={isDark ? '#aaa' : '#666'} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.commentAuthor}>{item.author}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
            style={styles.commentsList}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={comments.length > 3}
            // Ограничим высоту списка
            ListEmptyComponent={<Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 14 }}>Комментариев пока нет</Text>}
          />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.addCommentRow}>
              <TextInput
                style={styles.input}
                placeholder="Написать..."
                value={comment}
                onChangeText={setComment}
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                multiline={false}
                numberOfLines={1}
                returnKeyType="send"
                onSubmitEditing={handleAddComment}
              />
              <Button mode="contained" onPress={handleAddComment} style={[styles.sendButton, { backgroundColor: isDark ? '#00D26A' : '#00C060' }]}
                labelStyle={{ color: '#fff' }}>
                Отправить
              </Button>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
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
    commentsBlock: {
      margin: 16,
      backgroundColor: isDark ? '#222' : '#fff',
      borderRadius: 16,
      padding: 16,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginBottom: 12,
    },
    commentsList: {
      maxHeight: 120,
      marginBottom: 8,
    },
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    commentAuthor: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      fontSize: 14,
    },
    commentText: {
      color: isDark ? '#aaa' : '#666',
      fontSize: 14,
    },
    addCommentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
    },
    input: {
      flex: 1,
      backgroundColor: isDark ? '#111' : '#f0f0f0',
      color: isDark ? '#fff' : '#000',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      fontSize: 14,
      minHeight: 40,
      maxHeight: 40,
    },
    sendButton: {
      borderRadius: 8,
      elevation: 0,
    },
  });
}; 