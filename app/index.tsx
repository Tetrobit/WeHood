import { useQuery } from "@realm/react";
import Theme from "@/core/models/theme";
import { useRealm } from "@realm/react";
import { Redirect, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, useColorScheme } from "react-native";
import Profile from "@/core/models/profile";
import { useThemeName } from "@/core/hooks/useTheme";

export default function App() {
  const systemTheme = useColorScheme();
  const themeName = useThemeName();
  const [theme] = useQuery(Theme);
  const realm = useRealm();
  const [timeLeft, setTimeLeft] = useState(5);
  const [showNotice, setShowNotice] = useState(true);
  const progressAnimation = React.useRef(new Animated.Value(1)).current;
  const [profile] = useQuery(Profile);

  useEffect(() => {
    if (!showNotice) {
      if (profile) {
        if (!themeName) {
          router.replace('/greeting');
        }
        else {
          router.replace('/(tabs)');
        }
      }
      else {
        router.replace('/auth');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(timer);
  }, [showNotice]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowNotice(false);
    }
    if (theme) {
      realm.write(() => {
        realm.delete(theme);
      });
    }
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.notice}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowNotice(false)}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Демо-версия</Text>
        <Text style={styles.description}>
          Приложение находится на стадии разработки. Это демонстрационная версия того, как оно будет выглядеть в будущем.
        </Text>
        
        <View style={styles.timerContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  easing: Easing.linear,
                }),
              },
            ]} 
          />
          <Text style={styles.timer}>{timeLeft}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1.0)',
  },
  notice: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  timerContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  timer: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});
