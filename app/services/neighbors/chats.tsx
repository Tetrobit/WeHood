import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch, Image } from 'react-native';
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

const INTERESTS_CHATS: Record<string, {title: string, lastMessage: string, participants: number, avatar: string}> = {
  'Игры': {
    title: 'Любители настольных игр Казани',
    lastMessage: 'Встречаемся в субботу на турнире!',
    participants: 42,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  'Музыка': {
    title: 'Музыкальные вечера района',
    lastMessage: 'Кто идёт на концерт в парке?',
    participants: 31,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  'Спорт': {
    title: 'Спорт и пробежки по утрам',
    lastMessage: 'Завтра собираемся на стадионе в 7:00!',
    participants: 27,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  'Живопись': {
    title: 'Творческие встречи художников',
    lastMessage: 'Пленэр в воскресенье, кто с нами?',
    participants: 18,
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
  'Кино': {
    title: 'Клуб любителей кино',
    lastMessage: 'Обсуждаем новый фильм в пятницу!',
    participants: 22,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  'Кулинария': {
    title: 'Кулинары района',
    lastMessage: 'Делимся рецептами выпечки!',
    participants: 15,
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  'Путешествия': {
    title: 'Путешественники Казани',
    lastMessage: 'Кто был в Грузии? Поделитесь впечатлениями!',
    participants: 19,
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
  'Технологии': {
    title: 'IT и технологии',
    lastMessage: 'Обсуждаем новые гаджеты!',
    participants: 25,
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  'Фотография': {
    title: 'Фотоклуб района',
    lastMessage: 'Конкурс на лучшую фотографию весны!',
    participants: 12,
    avatar: 'https://i.pravatar.cc/150?img=16',
  },
  'Чтение': {
    title: 'Книжный клуб',
    lastMessage: 'Встреча по обсуждению книги в субботу.',
    participants: 20,
    avatar: 'https://i.pravatar.cc/150?img=17',
  },
};

const INTERESTS_ICONS: Record<string, string> = {
  'Игры': 'dice-multiple',
  'Музыка': 'music-note',
  'Спорт': 'soccer',
  'Живопись': 'palette',
  'Кино': 'movie-open',
  'Кулинария': 'food-apple',
  'Путешествия': 'airplane',
  'Технологии': 'laptop',
  'Фотография': 'camera',
  'Чтение': 'book-open-page-variant',
};

const DEFAULT_DISTRICT_CHAT_AVATAR = 'https://i.pravatar.cc/150?img=1';

// Моки сообщений для чатов по интересам
const INTERESTS_CHAT_MOCKS: Record<string, any[]> = {
  'Игры': [
    {
      id: '1',
      author: { firstName: 'Артём', lastName: 'Петров', avatar: 'https://i.pravatar.cc/150?img=4' },
      text: 'Всем привет! Кто идёт на турнир по настолкам в субботу?',
      createdAt: '2024-03-20T12:00:00',
      isAuthor: false,
    },
    {
      id: '2',
      author: { firstName: 'Светлана', lastName: 'Иванова', avatar: 'https://i.pravatar.cc/150?img=5' },
      text: 'Я! Уже готовлю свою коллекцию игр :)',
      createdAt: '2024-03-20T12:05:00',
      isAuthor: false,
    },
  ],
  'Музыка': [
    {
      id: '1',
      author: { firstName: 'Игорь', lastName: 'Смирнов', avatar: 'https://i.pravatar.cc/150?img=6' },
      text: 'Кто идёт на концерт в парке в пятницу?',
      createdAt: '2024-03-19T18:00:00',
      isAuthor: false,
    },
    {
      id: '2',
      author: { firstName: 'Мария', lastName: 'Кузнецова', avatar: 'https://i.pravatar.cc/150?img=7' },
      text: 'Я иду! Давайте соберёмся вместе.',
      createdAt: '2024-03-19T18:10:00',
      isAuthor: false,
    },
  ],
  'Спорт': [
    {
      id: '1',
      author: { firstName: 'Денис', lastName: 'Воробьёв', avatar: 'https://i.pravatar.cc/150?img=8' },
      text: 'Завтра пробежка в 7:00 на стадионе. Кто с нами?',
      createdAt: '2024-03-18T07:00:00',
      isAuthor: false,
    },
    {
      id: '2',
      author: { firstName: 'Ольга', lastName: 'Соколова', avatar: 'https://i.pravatar.cc/150?img=9' },
      text: 'Я присоединяюсь! Беру воду и хорошее настроение.',
      createdAt: '2024-03-18T07:05:00',
      isAuthor: false,
    },
  ],
  'Живопись': [
    {
      id: '1',
      author: { firstName: 'Елена', lastName: 'Миронова', avatar: 'https://i.pravatar.cc/150?img=10' },
      text: 'В воскресенье пленэр в парке. Приглашаю всех художников!',
      createdAt: '2024-03-17T11:00:00',
      isAuthor: false,
    },
    {
      id: '2',
      author: { firstName: 'Павел', lastName: 'Громов', avatar: 'https://i.pravatar.cc/150?img=11' },
      text: 'Я обязательно буду! Уже готовлю краски.',
      createdAt: '2024-03-17T11:10:00',
      isAuthor: false,
    },
  ],
  // ... другие интересы ...
};

// Получить сообщения чата (из AsyncStorage или моков)
async function getChatMessages(chatId: string, interest: string) {
  const saved = await AsyncStorage.getItem(`chat_messages_${chatId}`);
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch {}
  }
  if (interest && INTERESTS_CHAT_MOCKS[interest]) return INTERESTS_CHAT_MOCKS[interest];
  if (chatId === '1') return mockChats;
  return [];
}

export default function ChatsScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastMessages, setLastMessages] = useState<Record<string, {text: string, author: string, time: string}>>({});
  const [userInterests, setUserInterests] = useState<string[]>([]);

  // Загрузка состояния уведомлений
  useEffect(() => {
    AsyncStorage.getItem('chats_notifications_enabled').then(val => {
      if (val !== null) setNotificationsEnabled(val === 'true');
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('user_interests').then(val => {
      if (val) setUserInterests(JSON.parse(val));
      else setUserInterests([]);
    });
  }, []);

  const allChats = [
    ...mockChats.map((chat, idx) => ({
      ...chat,
      avatar: DEFAULT_DISTRICT_CHAT_AVATAR,
      chatTitle: chat.title,
      isInterest: false,
      interest: '',
    })),
    ...userInterests
      .filter((i) => INTERESTS_CHATS[i])
      .map((i, idx) => ({
        id: `interest-${i}`,
        title: INTERESTS_CHATS[i].title,
        lastMessage: INTERESTS_CHATS[i].lastMessage,
        lastMessageTime: '12:00',
        unreadCount: 0,
        participants: INTERESTS_CHATS[i].participants,
        isInterest: true,
        interest: i,
        avatar: INTERESTS_CHATS[i].avatar,
        chatTitle: INTERESTS_CHATS[i].title,
      })),
  ];

  useFocusEffect(
    React.useCallback(() => {
      async function loadAllLastMessages() {
        const result: Record<string, {text: string, author: string, time: string}> = {};
        for (const chat of allChats) {
          const isInterest = !!chat.isInterest;
          const interest = chat.interest || (chat.id.startsWith('interest-') ? chat.id.replace('interest-', '') : '');
          const chatId = chat.id;
          let messages = [];
          const saved = await AsyncStorage.getItem(`chat_messages_${chatId}`);
          if (saved) {
            try {
              const arr = JSON.parse(saved);
              if (Array.isArray(arr) && arr.length > 0) messages = arr;
            } catch {}
          }
          if (!messages.length && isInterest && INTERESTS_CHAT_MOCKS[interest]) {
            messages = INTERESTS_CHAT_MOCKS[interest];
          }
          if (!messages.length && chatId === '1') {
            messages = mockChats;
          }
          if (messages.length > 0) {
            const last = messages[messages.length - 1];
            result[chatId] = {
              text: last.text,
              author: last.author?.firstName || '',
              time: last.createdAt ? formatTime(last.createdAt) : '',
            };
          } else {
            // fallback на chat.lastMessage
            result[chatId] = { text: chat.lastMessage || '', author: '', time: chat.lastMessageTime || '' };
          }
        }
        setLastMessages(result);
      }
      loadAllLastMessages();
    }, [allChats.length]));

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('chats_notifications_enabled', value ? 'true' : 'false');
  };

  function getInterestKey(chat: any) {
    return chat.interest || (chat.id.startsWith('interest-') ? chat.id.replace('interest-', '') : '');
  }

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
        {allChats.map((chat: any) => {
          const lastMsg = lastMessages[chat.id];
          const isInterest = !!chat.isInterest;
          const interest = chat.interest || (chat.id.startsWith('interest-') ? chat.id.replace('interest-', '') : '');
          return (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => router.push({ pathname: `/services/neighbors/chat/[id]`, params: { id: chat.id, title: chat.chatTitle } })}
            >
              <View style={styles.chatIcon}>
                {chat.id === '1' ? (
                  <MaterialCommunityIcons name="account-group" size={36} color="#4CAF50" />
                ) : isInterest && INTERESTS_ICONS[interest] ? (
                  <MaterialCommunityIcons name={INTERESTS_ICONS[interest] as any} size={36} color="#4CAF50" />
                ) : (
                  <Image source={{ uri: chat.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
                )}
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>{chat.title}</Text>
                </View>
                <View style={styles.chatFooterRow}>
                  <View style={{ flex: 1, flexDirection: 'column', minWidth: 0 }}>
                    <Text style={styles.lastMessageRow} numberOfLines={2}>
                      {lastMsg?.author ? <Text style={styles.lastAuthor}>{lastMsg.author}: </Text> : null}
                      {lastMsg?.text || ''}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>{lastMsg?.time || ''}</Text>
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
    lineHeight: 18,
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
  lastMessageRow: { fontSize: 14, color: theme === 'dark' ? '#aaa' : '#666', lineHeight: 18, flexShrink: 1 },
}); 