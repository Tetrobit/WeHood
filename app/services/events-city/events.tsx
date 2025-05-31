import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, FAB, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Switch } from 'react-native';

const demoEvents = [
  {
    id: '1',
    title: 'Встреча соседей',
    description: 'Приглашаем всех на встречу во дворе для знакомства и общения!',
    image: 'https://pchela.news/storage/app/uploads/public/491/54f/fcc/thumb__770_490_0_0_crop.jpg',
    date: '2025-06-15',
  },
  {
    id: '2',
    title: 'Благотворительный забег',
    description: 'Участвуйте в забеге и помогите собрать средства на детскую площадку.',
    image: 'https://marathonec.ru/wp-content/uploads/2021/04/beg-vo-blago.jpg',
    date: '2025-06-20',
  },
];

export default function EventsCityScreen() {
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
        <Text style={styles.title}>События района</Text>
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Уведомления о событиях</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ flex: 1, color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 17 }}>Получать уведомления</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#00D2D2' }}
              thumbColor={theme === DARK_THEME ? '#00D2D2' : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
            <Text style={{ color: '#00D2D2', fontSize: 16 }}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView style={styles.eventsContainer}>
        {demoEvents.map((event) => (
          <Card
            key={event.id}
            style={styles.eventCard}
            onPress={() => router.push({ pathname: '/services/events-city/[id]', params: { id: event.id } })}
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
        onPress={() => router.push({ pathname: '/services/events-city/new' })}
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
    backgroundColor: '#00D2D2',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
}); 