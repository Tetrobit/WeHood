import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch } from 'react-native';
import { useTheme } from '@/core/hooks/useTheme';
import { router, useFocusEffect } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Моковые данные для чатов
const mockChats = [
  {
    id: '1',
    title: 'Обсуждение мероприятий Вахитовского района',
    lastMessage: 'Давайте обсудим субботник в парке',
    lastMessageTime: '10:30',
    unreadCount: 2,
    participants: 156,
  },
];

export default function ChatsScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastMessages, setLastMessages] = useState<{[id: string]: {text: string, time: string, author: string}} | null>(null);

  // Загрузка состояния уведомлений
  useEffect(() => {
    AsyncStorage.getItem('chats_notifications_enabled').then(val => {
      if (val !== null) setNotificationsEnabled(val === 'true');
    });
  }, []);

  // При фокусе экрана подгружаем последние сообщения для каждого чата
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchLastMessages = async () => {
        const result: {[id: string]: {text: string, time: string, author: string}} = {};
        for (const chat of mockChats) {
          const saved = await AsyncStorage.getItem(`chat_messages_${chat.id}`);
          let lastMsg = null;
          if (saved) {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr) && arr.length > 0) {
              lastMsg = arr[arr.length - 1];
            }
          }
          if (!lastMsg) {
            lastMsg = { text: chat.lastMessage, createdAt: new Date().toISOString(), author: '' };
          }
          result[chat.id] = {
            text: lastMsg.text,
            time: lastMsg.createdAt ? formatTime(lastMsg.createdAt) : '',
            author: lastMsg.author?.firstName || (lastMsg.isAuthor ? 'Вы' : ''),
          };
        }
        if (isActive) setLastMessages(result);
      };
      fetchLastMessages();
      return () => { isActive = false; };
    }, []));

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('chats_notifications_enabled', value ? 'true' : 'false');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, zIndex: 1 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.title, { textAlign: 'center' }]}>Чаты соседей</Text>
        </View>
        <TouchableOpacity onPress={() => setNotifModalVisible(true)} style={styles.headerDotsBtn}>
          <MaterialCommunityIcons name="dots-vertical" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatsList}>
        {mockChats.map((chat) => {
          const last = lastMessages?.[chat.id];
          return (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => router.push(`/services/neighbors/chat/${chat.id}`)}
            >
              <View style={styles.chatIcon}>
                <MaterialCommunityIcons name="account-group" size={24} color="#4CAF50" />
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>{chat.title}</Text>
                </View>
                <View style={styles.chatFooterRow}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
                    {last?.author ? (
                      <Text style={styles.lastAuthor} numberOfLines={1}>{last.author}: </Text>
                    ) : null}
                    <Text style={styles.chatLastMessage} numberOfLines={1}>
                      {last?.text || chat.lastMessage}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>{last?.time || chat.lastMessageTime}</Text>
                </View>
                <View style={styles.chatMeta}>
                  <Text style={styles.participantsCount}>
                    {chat.participants} участников
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Уведомления чатов</Text>
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
    </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#222' : '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#222' : '#eee',
  },
  chatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  chatFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 20, marginBottom: 2 },
  chatLastMessage: {
    flex: 1,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginRight: 8,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsCount: {
    fontSize: 12,
    color: theme === 'dark' ? '#888' : '#666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerDotsBtn: { position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: 56, height: 56, zIndex: 2 },
  lastAuthor: { fontWeight: '600', color: theme === 'dark' ? '#fff' : '#000', fontSize: 13, maxWidth: 80, flexShrink: 1 },
  chatTime: { marginLeft: 8, minWidth: 48, textAlign: 'right', fontSize: 12, color: theme === 'dark' ? '#aaa' : '#888', alignSelf: 'flex-start' },
}); 