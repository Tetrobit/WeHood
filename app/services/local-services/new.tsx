import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import ImagePicker from '../../components/ImagePicker';

export default function NewServiceScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const theme = useThemeName();
  const styles = makeStyles(theme);

  const handleSubmit = () => {
    // TODO: Implement API call to create service
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Новая услуга</Text>
      </View>

      <ScrollView style={styles.form}>
        <ImagePicker images={images} onImagesChange={setImages} maxImages={5} />
        <Text style={styles.label}>Название услуги</Text>
        <TextInput
          label="Название"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#FF9800',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Укажите цену услуги</Text>
        <TextInput
          label="Цена"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          right={<TextInput.Affix text="₽" />}
          theme={{
            colors: {
              primary: '#FF9800',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Категория (например: сантехник, электрик, уборка...)</Text>
        <TextInput
          label="Категория"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#FF9800',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Описание услуги (что делаете, опыт, детали...)</Text>
        <TextInput
          label="Описание"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          theme={{
            colors: {
              primary: '#FF9800',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Опубликовать
        </Button>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#222',
    marginBottom: 6,
    marginLeft: 2,
  },
}); 