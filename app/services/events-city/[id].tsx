import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';
import Modal from 'react-native-modal';

const demoEvents = [
  {
    id: '1',
    title: 'Встреча соседей',
    description: 'Приглашаем всех на встречу во дворе для знакомства и общения!',
    image: 'https://pchela.news/storage/app/uploads/public/491/54f/fcc/thumb__770_490_0_0_crop.jpg',
    date: '2025-06-15',
    organizer: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
  },
  {
    id: '2',
    title: 'Благотворительный забег',
    description: 'Участвуйте в забеге и помогите собрать средства на детскую площадку.',
    image: 'https://marathonec.ru/wp-content/uploads/2021/04/beg-vo-blago.jpg',
    date: '2025-06-20',
    organizer: 'Мария Иванова',
    phone: '+7 (999) 987-65-43',
  },
];

export default function EventCityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const event = demoEvents.find(e => e.id === id) || demoEvents[0];
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/services/events-city/events')} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.date}>{new Date(event.date).toLocaleDateString('ru-RU')}</Text>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.buttonRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <TouchableOpacity style={styles.comeButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.comeButtonText}>Я приду</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={() => {}}>
            <Text style={styles.contactButtonText}>Связаться с организатором</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Вы зарегистрированы</Text>
          <Text style={{ color: theme === 'dark' ? '#fff' : '#222', fontSize: 16, marginBottom: 18, textAlign: 'center' }}>Организатор будет видеть вашу вовлечённость</Text>
          <TouchableOpacity style={styles.returnButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.returnButtonText}>Ок</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#111' : '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 0,
  },
  content: {
    padding: 20,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -24,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    borderRadius: 16,
    elevation: 2,
  },
  date: {
    fontSize: 15,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginLeft: 4,
    flex: 1,
    textAlign: 'right',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#222',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  comeButton: {
    backgroundColor: '#00D2D2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  comeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  contactButton: {
    borderWidth: 2,
    borderColor: '#00D2D2',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  contactButtonText: {
    color: '#00D2D2',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  returnButton: {
    backgroundColor: '#00D2D2',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 