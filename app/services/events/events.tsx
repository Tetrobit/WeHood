import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, FAB, Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Switch } from 'react-native';

// Демо-мероприятия
const demoEvents = [
  {
    id: '1',
    title: 'Открытие нового парка',
    description: 'В эту субботу состоится открытие нового парка в центре города. Приглашаем всех!',
    image: 'https://static.tildacdn.com/tild3163-3437-4265-a261-353166373462/5353058457198124841.jpg',
    date: '2024-06-10',
  },
  {
    id: '2',
    title: 'Отключение воды',
    description: 'Внимание! 12 июня с 9:00 до 18:00 будет отключена вода в связи с ремонтными работами.',
    image: 'https://f78e1a6a-ca4c-458a-b3f0-9f53a2bad2a5.selstorage.ru/2025-04-22/MADa2UbcSajCxPqT.png',
    date: '2024-06-12',
  },
];

export default function EventsScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const theme = useThemeName();
  const styles = makeStyles(theme);

  const handleToggleNotifications = (value: boolean) => {
    setNotifications(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.replace('/')}
          style={styles.headerIcon}
          iconColor={theme === DARK_THEME ? '#fff' : '#000'}
        />
        <Text style={styles.title}>Объявления района</Text>
        <IconButton
          icon="dots-vertical"
          size={28}
          onPress={() => setNotifModalVisible(true)}
          style={styles.headerIcon}
          iconColor={theme === DARK_THEME ? '#fff' : '#000'}
        />
      </View>

      <Modal
        isVisible={notifModalVisible}
        onBackdropPress={() => setNotifModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={350}
        animationOutTiming={350}
        backdropOpacity={0.35}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View style={{ backgroundColor: theme === DARK_THEME ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Уведомления о мероприятиях</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ flex: 1, color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 17 }}>Получать уведомления</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#FFD600' }}
              thumbColor={theme === DARK_THEME ? '#FFD600' : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
            <Text style={{ color: '#FFD600', fontSize: 16 }}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView style={styles.eventsContainer}>
        {demoEvents.map((event) => (
          <Card
            key={event.id}
            style={styles.eventCard}
            onPress={() => router.push({ pathname: '/services/events/[id]', params: { id: event.id } })}
          >
            {event.image && (
              <Card.Cover source={{ uri: event.image }} style={styles.eventImage} />
            )}
            <Card.Content>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{new Date(event.date).toLocaleDateString('ru-RU')}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </Card.Content>
          </Card>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fabSmall}
        onPress={() => router.push({ pathname: '/services/events/new' })}
      />
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 0,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    textAlign: 'center',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  eventImage: {
    height: 180,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  eventDate: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 80,
  },
  fabSmall: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFD600',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
}); 