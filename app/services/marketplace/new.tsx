import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';

export default function NewListingScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const handleSubmit = () => {
    // TODO: Implement API call to create listing
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Новое объявление</Text>
      </View>

      <ScrollView style={styles.form}>
        <TextInput
          label="Название"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#007AFF',
              text: theme === 'dark' ? '#fff' : '#000',
              placeholder: theme === 'dark' ? '#aaa' : '#666',
              background: theme === 'dark' ? '#222' : '#fff',
            },
          }}
        />

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
              primary: '#007AFF',
              text: theme === 'dark' ? '#fff' : '#000',
              placeholder: theme === 'dark' ? '#aaa' : '#666',
              background: theme === 'dark' ? '#222' : '#fff',
            },
          }}
        />

        <TextInput
          label="Категория"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#007AFF',
              text: theme === 'dark' ? '#fff' : '#000',
              placeholder: theme === 'dark' ? '#aaa' : '#666',
              background: theme === 'dark' ? '#222' : '#fff',
            },
          }}
        />

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
              primary: '#007AFF',
              text: theme === 'dark' ? '#fff' : '#000',
              placeholder: theme === 'dark' ? '#aaa' : '#666',
              background: theme === 'dark' ? '#222' : '#fff',
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

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
}); 