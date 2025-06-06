import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/core/hooks/useTheme';
import { Theme } from '@/core/hooks/useTheme';
import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useApi, Notification } from '@/core/hooks/useApi';

const notificationIcons = {
  event: { icon: 'calendar-star', color: '#4ECDC4' },
  help: { icon: 'hand-heart', color: '#FF6B6B' },
  chat: { icon: 'chat', color: '#95E1D3' },
  system: { icon: 'cog', color: '#FFD93D' },
};

export default function NotificationsScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useApi();

  useEffect(() => {
    setupNotifications();
    loadNotifications();
  }, []);
  
  const registerForPushNotifications = useCallback(async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
      return null;
    }
  }, []);

  const setupNotifications = async () => {
    try {
      await registerForPushNotifications();
      
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const subscription = Notifications.addNotificationReceivedListener(notification => {
        loadNotifications();
      });

      return () => {
        subscription.remove();
      };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to setup notifications');
    }
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setError(null);
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setError(null);
      const success = await markAllNotificationsAsRead();
      if (success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      } else {
        throw new Error('Failed to mark all notifications as read');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark all notifications as read');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Уведомления</Text>
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
        >
          <Text style={styles.markAllText}>Отметить все как прочитанные</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка уведомлений...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadNotifications}
            >
              <Text style={styles.retryText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет новых уведомлений</Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <View key={notification.id}>
              <TouchableOpacity
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadNotification
                ]}
                activeOpacity={theme === 'dark' ? 0.8 : 0.7}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: notificationIcons[notification.type]?.color || '#666666' }
                ]}>
                  <MaterialCommunityIcons
                    name={notificationIcons[notification.type]?.icon || 'bell' as any}
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
              {index < notifications.length - 1 && <Divider style={{ backgroundColor: theme === 'dark' ? '#555' : '#eee' }} />}
            </View>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  markAllButton: {
    alignSelf: 'flex-end',
  },
  markAllText: {
    color: theme === 'dark' ? '#aaa' : '#007AFF',
    fontSize: 14,
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  unreadNotification: {
    backgroundColor: theme === 'dark' ? '#222' : '#f8f9fa',
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
    color: theme === 'dark' ? '#fff' : '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: theme === 'dark' ? '#aaa' : '#666',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    borderRadius: 8,
  },
  retryText: {
    color: theme === 'dark' ? '#fff' : '#007AFF',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: theme === 'dark' ? '#aaa' : '#666',
    fontSize: 16,
  },
}); 