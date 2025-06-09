import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Switch } from 'react-native';
import { useTheme } from '@/core/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Comment } from '@/app/components/Comment';
import { useUser } from '@/core/hooks/models/useUser';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Моковые данные для сообщений
const mockMessages = [
  {
    id: '1',
    author: {
      firstName: 'Анна',
      lastName: 'Петрова',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    text: 'Привет всем! Предлагаю организовать субботник в парке в эту субботу. Кто готов присоединиться?',
    createdAt: '2024-03-20T10:00:00',
    isAuthor: false,
  },
  {
    id: '2',
    author: {
      firstName: 'Иван',
      lastName: 'Смирнов',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    text: 'Я готов помочь! Во сколько планируем начать?',
    createdAt: '2024-03-20T10:05:00',
    isAuthor: false,
  },
  {
    id: '3',
    author: {
      firstName: 'Мария',
      lastName: 'Иванова',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    text: 'Давайте в 10 утра. Я могу принести перчатки и мешки для мусора.',
    createdAt: '2024-03-20T10:10:00',
    isAuthor: false,
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [theme] = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const styles = makeStyles(theme);
  const profile = useUser(SecureStore.getItem('user_id')!);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Загрузка сообщений и draft при открытии
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const saved = await AsyncStorage.getItem(`chat_messages_${id}`);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages(mockMessages);
        }
        const draft = await AsyncStorage.getItem(`chat_draft_${id}`);
        if (draft) setMessage(draft);
      }
    };
    loadData();
  }, [id]);

  // Сохраняем draft при изменении
  useEffect(() => {
    if (id) {
      AsyncStorage.setItem(`chat_draft_${id}`, message);
    }
  }, [message, id]);

  // Сохраняем сообщения при изменении
  useEffect(() => {
    if (id) {
      AsyncStorage.setItem(`chat_messages_${id}`, JSON.stringify(messages));
    }
  }, [messages, id]);

  // Загрузка состояния уведомлений
  useEffect(() => {
    if (id) {
      AsyncStorage.getItem(`chat_notifications_${id}`).then(val => {
        if (val !== null) setNotificationsEnabled(val === 'true');
      });
    }
  }, [id]);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (id) await AsyncStorage.setItem(`chat_notifications_${id}`, value ? 'true' : 'false');
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        author: {
          firstName: profile?.firstName || 'Вы',
          lastName: profile?.lastName || '',
          avatar: profile?.avatar || '',
        },
        text: message,
        createdAt: new Date().toISOString(),
        isAuthor: true,
      };
      setMessages([...messages, newMsg]);
      setMessage('');
      if (id) AsyncStorage.removeItem(`chat_draft_${id}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обсуждение мероприятий Вахитовского района</Text>
        <TouchableOpacity onPress={() => setNotifModalVisible(true)} style={styles.headerDotsBtn}>
          <MaterialCommunityIcons name="dots-vertical" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <Comment
            key={msg.id}
            author={msg.author}
            text={msg.text}
            createdAt={msg.createdAt}
            isAuthor={msg.isAuthor}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Написать сообщение..."
          placeholderTextColor={theme === 'dark' ? '#888' : '#666'}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <MaterialCommunityIcons 
            name="send" 
            size={24} 
            color={message.trim() ? '#4CAF50' : theme === 'dark' ? '#444' : '#ccc'} 
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={notifModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setNotifModalVisible(false)}
        >
          <View style={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 320, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Уведомления чата</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
              <Text style={{ flex: 1, color: theme === 'dark' ? '#fff' : '#222', fontSize: 17 }}>Включить уведомления</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme === 'dark' ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#222' : '#eee',
    position: 'relative',
  },
  headerBackBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    zIndex: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    zIndex: 1,
  },
  headerDotsBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    zIndex: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#222' : '#eee',
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: theme === 'dark' ? '#fff' : '#000',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 