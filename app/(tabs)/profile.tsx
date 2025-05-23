import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DARK_THEME, LIGHT_THEME, useSetTheme, useThemeName } from '@/core/hooks/useTheme';
import { useQuery } from '@realm/react';
import Profile from '@/core/models/profile';
import { router } from 'expo-router';
import useApi from '@/core/hooks/useApi';
export default function ProfileScreen() {
  const [profile] = useQuery(Profile);
  const api = useApi();
  const theme = useThemeName();
  const styles = makeStyles(theme);
  const setTheme = useSetTheme();

  const onChangeTheme = () => {
    setTheme(theme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
  }

  const onLogout = () => {
    Alert.alert('Мы будем скучать', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: async () => {
        try {
          await api.logout();
          router.push('/auth');
        } catch (error) {
          Alert.alert('Что-то пошло не так', error instanceof Error ? error.message : 'Произошла ошибка при выходе из системы');
        }
      }},
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profile?.avatar }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
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
        <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
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
