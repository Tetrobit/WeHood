import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type StoryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

interface StoriesViewProps {
  stories: StoryItem[];
  initialIndex: number;
}

export default function StoriesView({ stories, initialIndex }: StoriesViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [theme] = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return 0;
          } else {
            router.back();
            return 1;
          }
        }
        return prev + 0.01;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePress = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setProgress(0);
      } else {
        setCurrentIndex(0);
        setProgress(0);
      }
    } else {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setProgress(0);
      } else {
        router.back();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {stories.map((_, index) => (
          <View key={index} style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: `${index === currentIndex ? progress * 100 : index < currentIndex ? 100 : 0}%`,
                  backgroundColor: theme === 'dark' ? '#fff' : '#000',
                },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.storyContainer}>
        <TouchableOpacity
          style={[styles.touchArea, { left: 0 }]}
          onPress={() => handlePress('left')}
          activeOpacity={0.9}
        />
        <TouchableOpacity
          style={[styles.touchArea, { right: 0 }]}
          onPress={() => handlePress('right')}
          activeOpacity={0.9}
        />
        <Image
          source={{ uri: stories[currentIndex].image }}
          style={styles.storyImage}
        />
        <View style={styles.storyContent}>
          <Text style={[styles.storyTitle, { color: '#fff' }]}>
            {stories[currentIndex].title}
          </Text>
          <Text style={[styles.storyDescription, { color: '#fff' }]}>
            {stories[currentIndex].description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 5,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    borderRadius: 1,
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    width: width / 2,
    height: height,
    zIndex: 1,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 16,
  },
}); 