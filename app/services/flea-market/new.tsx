import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import ImagePicker from '../../components/ImagePicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function NewProductScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = useThemeName() ?? 'light';
  const styles = makeStyles(theme);

  const handleSubmit = () => {
    // TODO: Implement API call to create product
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, marginRight: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme === DARK_THEME ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { flex: 1, textAlign: 'center' }]}>Новое объявление</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.form}>
        <ImagePicker images={images} onImagesChange={setImages} maxImages={5} />
        <Text style={styles.label}>Название товара</Text>
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
        <Text style={styles.label}>Укажите цену товара</Text>
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
        <Text style={styles.label}>Категория (например: одежда, техника, мебель...)</Text>
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
        <Text style={styles.label}>Описание товара (состояние, особенности, детали...)</Text>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme === DARK_THEME ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
            <MaterialCommunityIcons name="check-circle" size={48} color="#FF9800" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Вещь отправлена на модерацию</Text>
            <Text style={{ color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 16, marginBottom: 18, textAlign: 'center' }}>После проверки модератором она появится в списке.</Text>
            <TouchableOpacity style={{ backgroundColor: '#FF9800', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 10 }} onPress={() => { setModalVisible(false); router.back(); }}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Вернуться</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
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
    backgroundColor: '#FF9800',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff'
  },
  label: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#222',
    marginBottom: 6,
    marginLeft: 2,
  },
}); 