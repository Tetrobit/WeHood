import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function NewVotingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>(['']);
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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

  const handleSubmit = () => {
    // TODO: Implement voting creation
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Создать голосование</Text>

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
        />

        <TextInput
          label="Описание"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
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
            />
            {options.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeOption(index)}
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
        >
          Добавить вариант
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!title || !description || options.some(opt => !opt) || !image}
        >
          Создать голосование
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