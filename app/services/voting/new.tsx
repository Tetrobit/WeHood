import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useApi } from '@/core/hooks/useApi';
import { compressImage } from '@/core/utils/image';

export default function NewVotingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>(['']);
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      setError('Не удалось выбрать изображение');
      console.error('Error picking image:', err);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || options.some(opt => !opt) || !image) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Сжатие изображения
      const compressedImage = await compressImage(image);
      
      // Сначала загружаем изображение
      const uploadResponse = await api.uploadFile(compressedImage, 'image/jpeg');

      // Создаем голосование
      const votingData = {
        title,
        description,
        image: uploadResponse.fileId,
        options: options
      };

      await api.createVoting(votingData);
      router.back();
    } catch (err) {
      setError('Не удалось создать голосование');
      console.error('Error creating voting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Создать голосование</Text>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="image-plus" size={48} color="#666" />
              <Text style={styles.imagePlaceholderText}>Добавить фото</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="Название голосования"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Описание"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
          disabled={loading}
        />

        <Text style={styles.sectionTitle}>Варианты выбора</Text>
        {options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <TextInput
              label={`Вариант ${index + 1}`}
              value={option}
              onChangeText={(value) => updateOption(index, value)}
              style={styles.optionInput}
              mode="outlined"
              disabled={loading}
            />
            {options.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeOption(index)}
                disabled={loading}
              >
                <MaterialCommunityIcons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Button
          mode="text"
          onPress={addOption}
          style={styles.addButton}
          disabled={loading}
        >
          Добавить вариант
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading || !title || !description || options.some(opt => !opt) || !image}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Создать голосование'
          )}
        </Button>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  imagePicker: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#333' : '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 8,
  },
}); 