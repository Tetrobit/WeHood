import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { DARK_THEME } from '@/core/hooks/useTheme';
import { useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewHelpScreen() {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useThemeName();
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/services/help/events')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === DARK_THEME ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>Создать запрос на помощь</Text>
      </View>
      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        <Text style={styles.label}>Фото</Text>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity style={styles.photoButtonOutline} onPress={pickImage}>
            <Text style={styles.photoButtonOutlineText}>Галерея</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButtonOutline} onPress={takePhoto}>
            <Text style={styles.photoButtonOutlineText}>Камера</Text>
          </TouchableOpacity>
        </View>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : null}
        <Text style={styles.label}>Заголовок</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          placeholder="Введите заголовок"
          theme={{
            colors: {
              primary: '#FF6B6B',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Описание</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Введите описание"
          theme={{
            colors: {
              primary: '#FF6B6B',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Цена</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          style={styles.input}
          placeholder="Укажите цену или 'Договорная'"
          theme={{
            colors: {
              primary: '#FF6B6B',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Имя</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          placeholder="Ваше имя"
          theme={{
            colors: {
              primary: '#FF6B6B',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
        <Text style={styles.label}>Телефон</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          placeholder="Ваш телефон для связи"
          keyboardType="phone-pad"
          theme={{
            colors: {
              primary: '#FF6B6B',
              text: theme === DARK_THEME ? '#fff' : '#000',
              placeholder: theme === DARK_THEME ? '#aaa' : '#666',
              background: theme === DARK_THEME ? '#222' : '#fff',
            },
          }}
        />
      </ScrollView>
      <View style={[styles.fixedButtonContainer, { paddingBottom: 16 + insets.bottom }]}> 
        <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
          <Text style={styles.publishButtonText}>Опубликовать</Text>
        </TouchableOpacity>
      </View>
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
        <View style={{ backgroundColor: theme === DARK_THEME ? '#222' : '#fff', borderRadius: 24, padding: 28, width: 340, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === DARK_THEME ? '#fff' : '#222', marginBottom: 24, textAlign: 'center' }}>Ваш запрос на помощь отправлен на публикацию</Text>
          <Text style={{ color: theme === DARK_THEME ? '#fff' : '#222', fontSize: 16, marginBottom: 18, textAlign: 'center' }}>Вам обязательно помогут!</Text>
          <TouchableOpacity style={styles.returnButton} onPress={() => { setModalVisible(false); router.replace('/services/help/events'); }}>
            <Text style={styles.returnButtonText}>Вернуться к списку</Text>
          </TouchableOpacity>
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
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    elevation: 2,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
    textAlign: 'center',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#222',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme === DARK_THEME ? '#444' : '#ccc',
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    color: theme === DARK_THEME ? '#fff' : '#222',
  },
  photoButtonOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  photoButtonOutlineText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
  },
  fixedButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    width: '92%',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 