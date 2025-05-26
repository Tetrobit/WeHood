import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DARK_THEME, LIGHT_THEME, useSetTheme, useThemeName } from '@/core/hooks/useTheme';
import { useQuery } from '@realm/react';
import Profile from '@/core/models/profile';
import { router } from 'expo-router';
import useApi from '@/core/hooks/useApi';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import Modal from 'react-native-modal';

export default function ProfileScreen() {
  const [profile] = useQuery(Profile);
  const api = useApi();
  const theme = useThemeName();
  const styles = makeStyles(theme);
  const setTheme = useSetTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(profile?.avatar);

  // --- уведомления ---
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [silentNotifications, setSilentNotifications] = useState(false);

  const onChangeTheme = () => {
    setTheme(theme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
  }

  const onLogout = () => {
    Alert.alert('Мы будем скучать', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: async () => {
        try {
          await api.logout();
          router.replace('/auth');
        } catch (error) {
          Alert.alert('Что-то пошло не так', error instanceof Error ? error.message : 'Произошла ошибка при выходе из системы');
        }
      }},
    ]);
  }

  const pickImage = async () => {
    setModalVisible(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // Отключение/включение уведомлений
  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      // Включить уведомления
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: !silentNotifications,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } else {
      // Отключить уведомления (не показывать)
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: false,
          shouldShowList: false,
        }),
      });
    }
  };

  // Беззвучные уведомления
  const toggleSilent = async (value: boolean) => {
    setSilentNotifications(value);
    if (notificationsEnabled) {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: !value,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Личная информация</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={theme === DARK_THEME ? '#fff' : '#222'} />
          <Text style={styles.menuText}>Редактировать профиль</Text>
          <Ionicons name="chevron-forward" size={24} color={theme === DARK_THEME ? '#fff' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
          <Ionicons name="settings-outline" size={24} color={theme === DARK_THEME ? '#fff' : '#222'} />
          <Text style={styles.menuText}>Настройки</Text>
          <Ionicons name="chevron-forward" size={24} color={theme === DARK_THEME ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Безопасность</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color={theme === DARK_THEME ? '#fff' : '#222'} />
          <Text style={styles.menuText}>Изменить пароль</Text>
          <Ionicons name="chevron-forward" size={24} color={theme === DARK_THEME ? '#fff' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={() => setNotifModalVisible(true)}>
          <Ionicons name="notifications-outline" size={24} color={theme === DARK_THEME ? '#fff' : '#222'} />
          <Text style={styles.menuText}>Уведомления</Text>
          <Ionicons name="chevron-forward" size={24} color={theme === DARK_THEME ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        <View style={[styles.menuItem, styles.lastMenuItem]}>
          <Ionicons 
            name={theme === DARK_THEME ? "moon" : "sunny"} 
            size={24} 
            color={theme === DARK_THEME ? '#fff' : '#222'} 
          />
          <Text style={styles.menuText}>Тёмная тема</Text>
          <Switch
            value={theme === DARK_THEME}
            onValueChange={onChangeTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={theme === DARK_THEME ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.35}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View style={{ backgroundColor: theme === DARK_THEME ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 320, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Сменить фото профиля</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#007AFF', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', shadowColor: '#007AFF', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            onPress={pickImage}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Выбрать из галереи</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: theme === DARK_THEME ? '#444' : '#eee', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' }}
            onPress={() => {}}
            disabled
          >
            <Text style={{ color: theme === DARK_THEME ? '#aaa' : '#888', fontSize: 17, fontWeight: '600' }}>Сгенерировать (скоро)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 4 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: '#007AFF', fontSize: 16 }}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={notifModalVisible}
        onBackdropPress={() => setNotifModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.35}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View style={{ backgroundColor: theme === DARK_THEME ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Настройки уведомлений</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ flex: 1, color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 17 }}>Отключение уведомлений</Text>
            <Switch
              value={!notificationsEnabled ? false : true}
              onValueChange={v => toggleNotifications(v)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === DARK_THEME ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ flex: 1, color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 17 }}>Беззвучные уведомления</Text>
            <Switch
              value={silentNotifications}
              onValueChange={v => toggleSilent(v)}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === DARK_THEME ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity activeOpacity={0.7} style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme === DARK_THEME ? '#007AFF' : '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  email: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#aaa' : '#666',
  },
  section: {
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    marginTop: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
