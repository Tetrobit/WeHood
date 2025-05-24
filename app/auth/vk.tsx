import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, BackHandler, Alert } from 'react-native';
import { useAuth } from '@/core/hooks/useAuth';

const VKAuth = () => {
  const { loginWithVK } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleVKAuth = async () => {
      try {
        // В React Native мы получаем параметры из URL через Linking
        // const url = 'wehood://auth/vk'; // Это пример, реальный URL будет передан через Linking
        // const params = new URLSearchParams(url.split('?')[1]);
        // const code = params.get('code');
        // const state = params.get('state');
        
        // if (!code || !state) {
        //   throw new Error('Отсутствуют необходимые параметры авторизации');
        // }

        // await loginWithVK(code, state);
        // Здесь можно использовать навигацию React Navigation
        // navigation.navigate('Profile');
        // console.log("OK");

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при авторизации');
      } finally {
        // setLoading(false);
      }
    };

    handleVKAuth();
  }, []);

  useEffect(() => {
    const backAction = () => {
      // Alert.alert('Подождите', 'Вы уверены, что хотите выйти из приложения?', [
      //   {
      //     text: 'Отмена',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   {text: 'Выйти', onPress: () => BackHandler.exitApp()},
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  console.log("loading:", loading);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>
            Выполняется авторизация...
          </Text>
        </>
      ) : error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default VKAuth;
