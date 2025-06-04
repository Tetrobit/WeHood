import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions, Easing } from 'react-native';

interface AnimatedTextProps {
  text: string;
  style?: any;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, style }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    console.log(containerWidth, textWidth, Dimensions.get('window').width);
    if (textWidth > containerWidth) {
      const duration = textWidth * 15; // Скорость прокрутки
      const startDelay = 1000; // Задержка перед началом
      const endDelay = 1000; // Задержка в конце

      Animated.loop(
        Animated.sequence([
          Animated.delay(startDelay),
          Animated.timing(scrollX, {
            toValue: -(textWidth - containerWidth),
            duration: duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.delay(endDelay),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [textWidth, containerWidth]);

  return (
    <View 
      style={[styles.container, style]}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ translateX: scrollX }],
          },
          style,
        ]}
        onLayout={(event) => {
          setTextWidth(event.nativeEvent.layout.width);
        }}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  text: {
    color: '#000',
  },
}); 