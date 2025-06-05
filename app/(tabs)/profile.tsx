import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert, Platform, Animated, TextInput, BackHandler, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/core/hooks/useTheme';
import { useQuery } from '@realm/react';
import UserModel from '@/core/models/UserModel';
import { router } from 'expo-router';
import useApi from '@/core/hooks/useApi';
import { useState, useRef, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import Modal from 'react-native-modal';
import { Easing } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeftIcon } from 'lucide-react-native';
import * as SecureStorage from 'expo-secure-store';
import { Theme } from '@/core/hooks/useTheme';
import { MEDIA_URL } from '@/core/constants/environment';
import UserAvatar from '../components/UserAvatar';
import { useUser } from '@/core/hooks/models/useUser';
import LottieView from 'lottie-react-native';

const HOBBIES = [
  'Спорт',
  'Музыка',
  'Игры',
  'Путешествия',
  'Кулинария',
  'Чтение',
  'Кино',
  'Технологии',
  'Искусство',
  'Фотография',
];

export default function ProfileScreen() {
  const profile = useUser(SecureStorage.getItem('user_id')!);
  const api = useApi();
  const [theme, setTheme] = useTheme();
  const styles = makeStyles(theme!);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  // --- уведомления ---
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [silentNotifications, setSilentNotifications] = useState(false);

  // --- Кастомный toast ---
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  // --- Модалка смены пароля ---
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { oldPassword: '', newPassword: '', repeatPassword: '' },
  });
  const newPassword = watch('newPassword');

  const [editTab, setEditTab] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    hobbies: [] as string[],
  });

  // Загрузка данных из AsyncStorage при открытии формы
  useEffect(() => {
    if (editTab) {
      setEditData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        hobbies: [],
      });
    }
  }, [editTab]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      } else if (passwordModalVisible) {
        setPasswordModalVisible(false);
        return true;
      } else if (notifModalVisible) {
        setNotifModalVisible(false);
        return true;
      } else if (editTab) {
        setEditTab(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [modalVisible, passwordModalVisible, notifModalVisible, editTab]);

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };
  const handleToggleHobby = (hobby: string) => {
    setEditData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const handleSaveEdit = async () => {
    await api.updateProfile({ firstName: editData.firstName, lastName: editData.lastName });
    setEditTab(false);
  };

  const onChangeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.15,
        allowsMultipleSelection: false,
        selectionLimit: 1
      });

      if (result.canceled || !result.assets || !result.assets[0]?.uri) {
        throw new Error('No image selected');
      }

      const file = await api.uploadFile(result.assets[0].uri, result.assets[0].mimeType || null);
      if (file.fileId) {
        console.log(`${MEDIA_URL}/files/${file.fileId}`)
        await api.updateProfile({ avatar: `${MEDIA_URL}/files/${file.fileId}` });
      }
    } catch (error) {
      console.log(error);
      showToast('Ошибка при загрузке фото');
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

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }).start(() => setToastVisible(false));
      }, 1800);
    });
  };

  const handleChangePassword = async (data: { oldPassword: string; newPassword: string; repeatPassword: string }) => {
    if (data.newPassword.length < 6) {
      showToast('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (data.newPassword !== data.repeatPassword) {
      showToast('Пароли не совпадают');
      return;
    }
    try {
      // Мок: имитируем успешную смену пароля
      await new Promise(res => setTimeout(res, 1000));
      showToast('Пароль успешно изменён');
      setPasswordModalVisible(false);
      reset();
    } catch (e) {
      showToast('Ошибка смены пароля');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const userId = await SecureStorage.getItem('user_id');
      if (userId) {
        await api.getUserById(userId);
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const generateAvatar = async () => {
    setModalVisible(false);
    try {
      setLoadingModalVisible(true);
      const response = await api.generateAvatar();
      await api.updateProfile({ avatar: response.avatar });
    } catch (error) {
      showToast('Ошибка при генерации аватара');
    } finally {
      setLoadingModalVisible(false);
    }
  }

  if (editTab) {
    return (
      <View style={[styles.container, { padding: 20 }]}> 
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, position: 'relative', height: 36 }}>
          <TouchableOpacity onPress={() => setEditTab(false)} style={{ position: 'absolute', left: 0, top: 0, padding: 2, zIndex: 2 }}>
            <ArrowLeftIcon size={22} color={theme === 'dark' ? '#fff' : '#222'} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme === 'dark' ? '#fff' : '#222', textAlign: 'center' }}>Редактировать профиль</Text>
          </View>
        </View>
        <Text style={{ color: theme === 'dark' ? '#aaa' : '#666', fontSize: 15, marginBottom: 2, marginLeft: 4 }}>Имя</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme === 'dark' ? '#fff' : '#222',
              backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
              borderWidth: 1,
              borderColor: theme === 'dark' ? '#444' : '#ccc',
              borderRadius: 10,
            },
          ]}
          placeholder="Имя"
          placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          value={editData.firstName}
          onChangeText={v => handleEditChange('firstName', v)}
        />
        <Text style={{ color: theme === 'dark' ? '#aaa' : '#666', fontSize: 15, marginBottom: 2, marginTop: 8, marginLeft: 4 }}>Фамилия</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme === 'dark' ? '#fff' : '#222',
              backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
              borderWidth: 1,
              borderColor: theme === 'dark' ? '#444' : '#ccc',
              borderRadius: 10,
            },
          ]}
          placeholder="Фамилия"
          placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          value={editData.lastName}
          onChangeText={v => handleEditChange('lastName', v)}
        />
        <Text style={{ color: theme === 'dark' ? '#fff' : '#222', fontSize: 16, marginTop: 18, marginBottom: 8 }}>Увлечения:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {HOBBIES.map(hobby => (
            <TouchableOpacity
              key={hobby}
              style={{
                backgroundColor: editData.hobbies.includes(hobby)
                  ? (theme === 'dark' ? '#007AFF' : '#007AFF')
                  : (theme === 'dark' ? '#333' : '#eee'),
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 7,
                marginBottom: 6,
                marginRight: 6,
                marginTop: 0,
              }}
              onPress={() => handleToggleHobby(hobby)}
            >
              <Text style={{ color: editData.hobbies.includes(hobby) ? '#fff' : (theme === 'dark' ? '#fff' : '#222'), fontSize: 15 }}>{hobby}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#007AFF', borderRadius: 12, padding: 16, marginTop: 24, alignItems: 'center' }}
          onPress={handleSaveEdit}
        >
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Кастомный toast */}
      {toastVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 32,
            zIndex: 100,
            alignItems: 'center',
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}
          pointerEvents="none"
        >
          <View style={{
            backgroundColor: theme === 'dark' ? '#222' : '#fff',
            borderColor: theme === 'dark' ? '#444' : '#ddd',
            borderWidth: 1,
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingVertical: 14,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            minWidth: 180,
            maxWidth: 320,
          }}>
            <Text style={{ color: theme === 'dark' ? '#fff' : '#222', fontSize: 16, textAlign: 'center' }}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={theme === 'dark' ? '#fff' : '#007AFF'}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserAvatar firstName={profile?.firstName || ''} lastName={profile?.lastName || ''} avatar={profile?.avatar || ''} size={100} />
            <TouchableOpacity style={styles.editAvatarButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Личная информация</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => setEditTab(true)}>
            <Ionicons name="person-outline" size={24} color={theme === 'dark' ? '#fff' : '#222'} />
            <Text style={styles.menuText}>Редактировать профиль</Text>
            <Ionicons name="chevron-forward" size={24} color={theme === 'dark' ? '#fff' : '#999'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={() => showToast('В разработке...')}>
            <Ionicons name="settings-outline" size={24} color={theme === 'dark' ? '#fff' : '#222'} />
            <Text style={styles.menuText}>Настройки</Text>
            <Ionicons name="chevron-forward" size={24} color={theme === 'dark' ? '#fff' : '#999'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Безопасность</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => setPasswordModalVisible(true)}>
            <Ionicons name="lock-closed-outline" size={24} color={theme === 'dark' ? '#fff' : '#222'} />
            <Text style={styles.menuText}>Изменить пароль</Text>
            <Ionicons name="chevron-forward" size={24} color={theme === 'dark' ? '#fff' : '#999'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={() => setNotifModalVisible(true)}>
            <Ionicons name="notifications-outline" size={24} color={theme === 'dark' ? '#fff' : '#222'} />
            <Text style={styles.menuText}>Уведомления</Text>
            <Ionicons name="chevron-forward" size={24} color={theme === 'dark' ? '#fff' : '#999'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>
          <View style={[styles.menuItem, styles.lastMenuItem]}>
            <Ionicons 
              name={theme === 'dark' ? "moon" : "sunny"} 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#222'} 
            />
            <Text style={styles.menuText}>Тёмная тема</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={onChangeTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === 'dark' ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>
        <TouchableOpacity style={[styles.rustoreBox, { backgroundColor: theme === 'dark' ? '#111' : '#f2f2f7' }]} activeOpacity={0.8} onPress={() => Linking.openURL('https://www.rustore.ru/catalog/app/com.so_dam.wehood')}>
          <Text style={[styles.rustoreText, { color: theme === 'dark' ? '#fff' : '#222' }]}>Пожалуйста, оставьте отзыв на RuStore, нам важно знать ваше мнение</Text>
        </TouchableOpacity> 

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
          <View style={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 320, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Сменить фото профиля</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#007AFF', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', shadowColor: '#007AFF', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
              onPress={pickImage}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Выбрать из галереи</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#007AFF', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' }}
              onPress={() => generateAvatar()}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Сгенерировать</Text>
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
          animationInTiming={350}
          animationOutTiming={350}
          backdropOpacity={0.35}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}
          style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
        >
          <View style={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Настройки уведомлений</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
              <Text style={{ flex: 1, color: theme === 'dark' ? '#fff' : '#222', fontSize: 17 }}>Отключение уведомлений</Text>
              <Switch
                value={!notificationsEnabled ? false : true}
                onValueChange={v => toggleNotifications(v)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme === 'dark' ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}>
              <Text style={{ flex: 1, color: theme === 'dark' ? '#fff' : '#222', fontSize: 17 }}>Беззвучные уведомления</Text>
              <Switch
                value={silentNotifications}
                onValueChange={v => toggleSilent(v)}
                disabled={!notificationsEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme === 'dark' ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 4 }} onPress={() => setNotifModalVisible(false)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Модальное окно смены пароля */}
        <Modal
          isVisible={passwordModalVisible}
          onBackdropPress={() => setPasswordModalVisible(false)}
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Изменить пароль</Text>
            <Text style={{ color: theme === 'dark' ? '#aaa' : '#666', fontSize: 14, marginBottom: 10, textAlign: 'center' }}>
              Введите старый пароль (если вход через VK — оставьте поле пустым)
            </Text>
            <Controller
              control={control}
              name="oldPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { color: theme === 'dark' ? '#fff' : '#222', backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
                  placeholder="Старый пароль"
                  placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { color: theme === 'dark' ? '#fff' : '#222', backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
                  placeholder="Новый пароль"
                  placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="repeatPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { color: theme === 'dark' ? '#fff' : '#222', backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
                  placeholder="Повторите пароль"
                  placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#007AFF', borderRadius: 12, padding: 16, marginTop: 10, alignItems: 'center' }}
              onPress={handleSubmit(handleChangePassword)}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setPasswordModalVisible(false)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Модальное окно загрузки */}
        <Modal
          isVisible={loadingModalVisible}
          backdropOpacity={0.35}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
        >
          <View style={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 300, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme === 'dark' ? '#fff' : '#222', marginBottom: 16, textAlign: 'center' }}>
              Генерируем для вас изображение...
            </Text>
            <LottieView
              source={require('@/assets/lottie/drawing.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        </Modal>

        <TouchableOpacity activeOpacity={0.7} style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
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
    backgroundColor: theme === 'dark' ? '#007AFF' : '#007AFF',
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
    color: theme === 'dark' ? '#fff' : '#222',
  },
  email: {
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  section: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    marginTop: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme === 'dark' ? '#fff' : '#222',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: theme === 'dark' ? '#fff' : '#222',
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
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    marginBottom: 10,
  },
  rustoreBox: {
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rustoreText: {
    backgroundColor: 'transparent',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
