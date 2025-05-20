import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function CustomImagePicker({ images, onImagesChange, maxImages = 10 }: ImagePickerProps) {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  const pickImage = async () => {
    if (images.length >= maxImages) {
      // В реальном приложении здесь должно быть уведомление
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <MaterialCommunityIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        
        {images.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <MaterialCommunityIcons 
              name="camera-plus" 
              size={32} 
              color={theme === DARK_THEME ? '#fff' : '#000'} 
            />
            <Text style={styles.addButtonText}>
              Добавить фото ({images.length}/{maxImages})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    padding: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  image: {
    width: 160,
    height: 90,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 160,
    height: 90,
    backgroundColor: theme === DARK_THEME ? '#222' : '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme === DARK_THEME ? '#333' : '#ddd',
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: theme === DARK_THEME ? '#fff' : '#000',
    textAlign: 'center',
  },
}); 