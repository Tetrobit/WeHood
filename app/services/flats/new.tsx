import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import CustomImagePicker from '@/app/components/ImagePicker';

interface FormData {
  title: string;
  description: string;
  price: string;
  address: string;
  rooms: string;
  area: string;
  floor: string;
  totalFloors: string;
  images: string[];
}

export default function NewFlatScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    address: '',
    rooms: '',
    area: '',
    floor: '',
    totalFloors: '',
    images: [],
  });

  const handleSubmit = () => {
    // В реальном приложении здесь будет отправка данных на сервер
    console.log('Form data:', formData);
    router.back();
  };

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons 
              name="close" 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>Новое объявление</Text>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              !formData.title && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!formData.title}
          >
            <Text style={styles.submitButtonText}>Опубликовать</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Загрузка фотографий */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Фотографии</Text>
            <CustomImagePicker
              images={formData.images}
              onImagesChange={(images) => updateField('images', images)}
            />
          </View>

          {/* Основная информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Основная информация</Text>
            <TextInput
              style={styles.input}
              placeholder="Заголовок объявления"
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Описание квартиры"
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
            />
          </View>

          {/* Характеристики */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Характеристики</Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Цена ₽/мес"
                  placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(value) => updateField('price', value)}
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Комнат"
                  placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                  keyboardType="numeric"
                  value={formData.rooms}
                  onChangeText={(value) => updateField('rooms', value)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Площадь м²"
                  placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                  keyboardType="numeric"
                  value={formData.area}
                  onChangeText={(value) => updateField('area', value)}
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Этаж"
                  placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                  keyboardType="numeric"
                  value={formData.floor}
                  onChangeText={(value) => updateField('floor', value)}
                />
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Этажей в доме"
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              keyboardType="numeric"
              value={formData.totalFloors}
              onChangeText={(value) => updateField('totalFloors', value)}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#111' : '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: theme === 'dark' ? '#fff' : '#000',
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#333' : '#eee',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
}); 