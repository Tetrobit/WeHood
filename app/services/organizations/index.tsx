import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from "@/core/hooks/useTheme";
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Switch } from 'react-native';

const demoOrganizations = [
  {
    id: '1',
    title: 'Городская поликлиника №1',
    category: 'Медицинские организации',
    description: 'Многопрофильная поликлиника с широким спектром медицинских услуг',
    image: 'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
    address: 'ул. Ленина, 10',
    phone: '+7 (999) 111-22-33',
    workingHours: 'Пн-Пт: 8:00-20:00',
  },
  {
    id: '2',
    title: 'Кафе "Уютное место"',
    category: 'Малый бизнес',
    description: 'Уютное кафе с домашней кухней и приятной атмосферой',
    image: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg',
    address: 'пр. Мира, 25',
    phone: '+7 (999) 222-33-44',
    workingHours: 'Ежедневно: 9:00-23:00',
  },
  {
    id: '3',
    title: 'Детский сад "Солнышко"',
    category: 'Образование',
    description: 'Частный детский сад с развивающими программами',
    image: 'https://img.freepik.com/free-photo/children-playing-kindergarten_23-2148634434.jpg',
    address: 'ул. Пушкина, 15',
    phone: '+7 (999) 333-44-55',
    workingHours: 'Пн-Пт: 7:00-19:00',
  },
  {
    id: '4',
    title: 'Фитнес-центр "Энергия"',
    category: 'Спорт и здоровье',
    description: 'Современный фитнес-центр с бассейном и тренажерным залом',
    image: 'https://img.freepik.com/free-photo/fitness-trainer-with-dumbbells_23-2148331336.jpg',
    address: 'ул. Спортивная, 5',
    phone: '+7 (999) 444-55-66',
    workingHours: 'Ежедневно: 6:00-24:00',
  },
];

export default function OrganizationsScreen() {
  const { category } = useLocalSearchParams();
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleToggleNotifications = (value: boolean) => {
    setNotifications(value);
  };

  const filteredOrganizations = category 
    ? demoOrganizations.filter(org => org.category === category)
    : demoOrganizations;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.back()}
          style={styles.headerIcon}
          iconColor={theme === 'dark' ? '#fff' : '#000'}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={styles.title}>
            {category ? `${category}` : 'Организации района'}
          </Text>
        </View>
        <IconButton
          icon="dots-vertical"
          size={28}
          onPress={() => setNotifModalVisible(true)}
          style={styles.headerIcon}
          iconColor={theme === 'dark' ? '#fff' : '#000'}
        />
      </View>
      <ScrollView style={styles.organizationsContainer}>
        {filteredOrganizations.map((org) => (
          <Card
            key={org.id}
            style={styles.orgCard}
            onPress={() => router.push({ pathname: '/services/organizations/[id]', params: { id: org.id } })}
          >
            <Card.Cover source={{ uri: org.image }} style={styles.orgImage} />
            <Card.Content>
              <Text style={styles.orgCategory}>{org.category}</Text>
              <Text style={styles.orgTitle}>{org.title}</Text>
              <Text style={styles.orgDescription}>{org.description}</Text>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.orgInfo}>{org.address}</Text>
              </View>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="phone" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.orgInfo}>{org.phone}</Text>
              </View>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.orgInfo}>{org.workingHours}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
        <View style={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Уведомления об организациях</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ flex: 1, color: theme === 'dark' ? '#fff' : '#222', fontSize: 17 }}>Получать уведомления</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#E91E63' }}
              thumbColor={theme === 'dark' ? '#E91E63' : '#E91E63'}
            />
          </View>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
            <Text style={{ color: '#E91E63', fontSize: 16 }}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 0,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    textAlign: 'center',
  },
  organizationsContainer: {
    flex: 1,
    padding: 16,
  },
  orgCard: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  orgImage: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
  },
  orgCategory: {
    fontSize: 14,
    color: '#E91E63',
    marginTop: 8,
    fontWeight: '500',
  },
  orgTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  orgDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginVertical: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  orgInfo: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  bottomSpacer: {
    height: 20,
  },
}); 