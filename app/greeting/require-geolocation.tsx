'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

// Схема для хранения координат
const CoordinatesSchema = {
  name: 'Coordinates',
  primaryKey: 'id',
  properties: {
    id: 'int',
    latitude: 'double',
    longitude: 'double',
    timestamp: 'date'
  }
};

export default function RequireGeolocation() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const saveCoordinates = async (latitude: number, longitude: number) => {
    const realm = await Realm.open({ schema: [CoordinatesSchema] });
    
    try {
      realm.write(() => {
        // Удаляем старые координаты
        realm.delete(realm.objects('Coordinates'));
        
        // Сохраняем новые координаты
        realm.create('Coordinates', {
          id: 1,
          latitude,
          longitude,
          timestamp: new Date()
        });
      });
    } finally {
      realm.close();
    }
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Для работы приложения необходимо разрешить доступ к геолокации');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Сохраняем координаты в Realm
      await saveCoordinates(location.coords.latitude, location.coords.longitude);
      
      // Перенаправляем на главный экран
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } catch (err) {
      let errorMessage = 'Произошла ошибка при получении геолокации';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Запрашиваем доступ к геолокации...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Требуется геолокация</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setLoading(true);
            setError(null);
            requestLocation();
          }}
        >
          <Text style={styles.buttonText}>Попробовать снова</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
