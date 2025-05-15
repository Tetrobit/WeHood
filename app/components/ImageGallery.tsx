import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';

interface ImageGalleryProps {
  images: string[];
}

const { width: screenWidth } = Dimensions.get('window');

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={screenWidth}
        height={300}
        data={images}
        scrollAnimationDuration={500}
        onSnapToItem={setActiveIndex}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
        >
          <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  controls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 