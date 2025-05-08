import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'help' | 'chat' | 'system';
  isRead: boolean;
};

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Новое событие',
    message: 'Завтра в 15:00 состоится субботник в парке',
    time: '2 часа назад',
    type: 'event',
    isRead: false,
  },
  {
    id: '2',
    title: 'Запрос на помощь',
    message: 'Мария просит помочь с доставкой продуктов',
    time: '3 часа назад',
    type: 'help',
    isRead: true,
  },
  {
    id: '3',
    title: 'Новое сообщение',
    message: 'У вас есть новое сообщение в чате соседей',
    time: '5 часов назад',
    type: 'chat',
    isRead: false,
  },
  {
    id: '4',
    title: 'Обновление системы',
    message: 'Доступно новое обновление приложения',
    time: '1 день назад',
    type: 'system',
    isRead: true,
  },
];

const notificationIcons = {
  event: { icon: 'calendar-star', color: '#4ECDC4' },
  help: { icon: 'hand-heart', color: '#FF6B6B' },
  chat: { icon: 'chat', color: '#95E1D3' },
  system: { icon: 'cog', color: '#FFD93D' },
};

export default function NotificationsScreen() {
  const markAsRead = (id: string) => {
    // Здесь будет логика отметки уведомления как прочитанного
    console.log('Mark as read:', id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Уведомления</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Отметить все как прочитанные</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <View key={notification.id}>
            <TouchableOpacity
              style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: notificationIcons[notification.type].color }
              ]}>
                <MaterialCommunityIcons
                  name={notificationIcons[notification.type].icon as any}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
            </TouchableOpacity>
            {index < notifications.length - 1 && <Divider />}
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  markAllButton: {
    alignSelf: 'flex-end',
  },
  markAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
}); 