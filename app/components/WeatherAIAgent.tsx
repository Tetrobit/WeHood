import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

interface WeatherAIAgentProps {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  recommendation: string | null;
}

export default function WeatherAIAgent({ visible, onClose, isLoading, recommendation }: WeatherAIAgentProps) {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>

            <View style={styles.agentInfo}>
              {!isLoading && (
                <LottieView
                  source={require('@/assets/lottie/ai-helper.json')}
                  style={styles.agentIcon}
                  autoPlay
                  loop={false}
                />
              )}
            </View>
            <View style={{ width: 24 }} />
            <Text style={styles.title}>ИИ-помощник</Text>
            {isLoading && <View style={{ width: 24 }} />}
            {!isLoading && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={require('@/assets/lottie/ai-weather.json')}
                  style={styles.loadingAnimation}
                  autoPlay
                  loop
                />
                <Text style={styles.loadingText}>Получаю рекомендации...</Text>
              </View>
            ) : (
              <Text style={styles.recommendation}>{recommendation}</Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  agentInfo: {
    position: 'absolute',
    left: -20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agentIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    minHeight: 250,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 16,
  },
  recommendation: {
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 16,
    lineHeight: 24,
  },
}); 