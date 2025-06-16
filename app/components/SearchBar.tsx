import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, Text, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import LottieView from 'lottie-react-native';
import axios, { AxiosRequestConfig } from 'axios';
import useApi from '@/core/hooks/useApi';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text?: string;
  isUser: boolean;
  timestamp: Date;
  audioUri?: string;
  transcript?: string;
  showTranscript?: boolean;
}

interface SearchBarProps {
  onSearch: (text: string) => void;
  onVoiceSearch: (audioUri: string) => void;
}

const AudioMessage: React.FC<{ message: Message }> = ({ message }) => {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showTranscript, setShowTranscript] = React.useState(message.showTranscript || false);
  const [theme] = useTheme();
  const styles = makeStyles(theme!);

  const playAudio = async () => {
    if (sound) {
      await sound.replayAsync();
      setIsPlaying(true);
      return;
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: message.audioUri! });
    setSound(newSound);
    setIsPlaying(true);
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) setIsPlaying(false);
    });
    await newSound.playAsync();
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio} style={{ marginRight: 10 }}>
            <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={28} color={message.isUser ? '#fff' : '#007AFF'} />
          </TouchableOpacity>
          {/* Имитация волны */}
          <View style={{ width: 60, height: 24, justifyContent: 'center', marginRight: 10 }}>
            <View style={{ height: 16, backgroundColor: message.isUser ? '#fff' : '#007AFF', borderRadius: 8, opacity: 0.3 }} />
          </View>
          <Text style={{ color: message.isUser ? '#fff' : '#007AFF', marginRight: 10 }}>0:30</Text>
          <TouchableOpacity onPress={() => setShowTranscript(!showTranscript)} style={{ backgroundColor: '#e6f0ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Aa</Text>
          </TouchableOpacity>
        </View>
        {showTranscript && (
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
            { marginTop: 8 }
          ]}>{message.transcript}</Text>
        )}
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const [theme] = useTheme();
  const styles = makeStyles(theme!);
  if (message.audioUri) {
    return <AudioMessage message={message} />;
  }
  return (
    <View 
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}
    >
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onVoiceSearch }) => {
  const api = useApi();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme] = useTheme();
  const styles = makeStyles(theme!);
  
  const recording = useRef<Audio.Recording | null>(null);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleExit = () => {
    if (messages.length > 0) {
      Alert.alert(
        'Подтверждение',
        'Вы уверены, что хотите выйти? Все сообщения будут удалены.',
        [
          {
            text: 'Отмена',
            style: 'cancel'
          },
          {
            text: 'Выйти',
            style: 'destructive',
            onPress: () => {
              setMessages([]);
              setIsExpanded(false);
            }
          }
        ]
      );
    } else {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    if (isExpanded) {
      handleExit();
    } else {
      const toValue = 1;
      setIsExpanded(true);
      Animated.spring(expandAnim, {
        toValue,
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }).start();
    }
  };

  const handleSendMessage = () => {
    if (!searchText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: searchText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    onSearch(searchText);
    setSearchText('');

    // Имитация ответа ИИ
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Я ищу информацию по вашему запросу...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording.current) return;

    setIsRecognizing(true);
    setIsRecording(false);
    await recording.current!.stopAndUnloadAsync();
    const uri = recording.current!.getURI();
    recording.current = null;
    for (let i = 0; i < 3; i++) {
      try {
        if (uri) {
          onVoiceSearch(uri);
          // Показываем лоадер, пока идет распознавание
          const response = await api.recognize(uri);
          const text = response.result[0];

          const newMessage: Message = {
            id: Date.now().toString(),
            audioUri: uri,
            transcript: text,
            isUser: true,
            timestamp: new Date(),
            showTranscript: false,
          };
          setMessages(prev => [...prev, newMessage]);
          setIsRecognizing(false);
          return true;
        }
      } catch (err) {
        // Ignore
      }
    }
    setIsRecognizing(false);
  };

  const handleVoicePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={toggleExpand} style={styles.initialSearchBar}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color={theme === 'dark' ? '#fff' : '#000'} 
        />
        <Text style={styles.initialSearchText}>Хотите что-то найти?</Text>
      </TouchableOpacity>

      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="fade"
        onRequestClose={handleExit}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View style={[
            styles.modalContent,
            {
              opacity: expandAnim,
              transform: [{
                translateY: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            },
          ]}>
            <View style={styles.searchHeader}>
              <TouchableOpacity onPress={toggleExpand} style={styles.backButton}>
                <MaterialCommunityIcons 
                  name="arrow-left" 
                  size={24} 
                  color={theme === 'dark' ? '#fff' : '#000'} 
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Поиск</Text>
            </View>

            {!messages.length && (
              <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 100}}>
                <LottieView
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  source={require('@/assets/lottie/ai-search')}
                  autoPlay
                  speed={0.6}
                />
              </View>
            )}

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => <MessageItem key={msg.id} message={msg} />)}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Введите запрос..."
                placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                editable={!isRecognizing && !isRecording}
              />
              {!searchText.trim() && !isRecognizing &&
                <TouchableOpacity onPress={handleVoicePress} style={styles.voiceButton} disabled={isRecognizing}>
                  <MaterialCommunityIcons 
                    name={isRecording ? "microphone" : "microphone-outline"} 
                    size={24} 
                    color={isRecording ? '#ff4444' : (theme === 'dark' ? '#fff' : '#000')} 
                  />
                </TouchableOpacity>
              }
              {searchText.trim() &&
                <TouchableOpacity 
                  onPress={handleSendMessage}
                  style={styles.sendButton}
                  disabled={!searchText.trim() || isRecognizing || isRecording}
                >
                  <MaterialCommunityIcons 
                    name="send" 
                    size={24} 
                    color={searchText.trim() && !isRecognizing && !isRecording ? (theme === 'dark' ? '#fff' : '#000') : '#666'} 
                  />
                </TouchableOpacity>
              }
              {isRecognizing && (
                <View style={{ marginLeft: 10 }}>
                  <LottieView
                    style={{ width: 40, height: 40 }}
                    source={require('@/assets/lottie/loader.json')}
                    autoPlay
                    loop
                  />
                </View>
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  initialSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  initialSearchText: {
    marginLeft: 10,
    color: theme === 'dark' ? '#fff' : '#666',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginLeft: 10,
  },
  backButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: theme === 'dark' ? '#2b5278' : '#007AFF',
  },
  aiBubble: {
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: theme === 'dark' ? '#fff' : '#000',
  },
  timestamp: {
    fontSize: 12,
    color: theme === 'dark' ? '#999' : '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#333' : '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: theme === 'dark' ? '#fff' : '#000',
    fontSize: 16,
  },
  voiceButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
}); 