import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { useApi, VotingById } from '@/core/hooks/useApi';
import { getFileUrl } from '@/core/utils/url';

export default function VotingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const api = useApi();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<VotingById | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVoting();
  }, [id]);

  const loadVoting = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVotingById(id);
      setVoting(data);
    } catch (err) {
      setError('Не удалось загрузить голосование');
      console.error('Error loading voting:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption !== null && !hasVoted && voting) {
      try {
        setLoading(true);
        const response = await api.vote(voting.id, selectedOption);
        if (response.ok) {
          setHasVoted(true);
          // Перезагружаем голосование для обновления результатов
          await loadVoting();
        } else {
          setError(response.message || 'Не удалось проголосовать');
        }
      } catch (err) {
        setError('Произошла ошибка при голосовании');
        console.error('Error voting:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !voting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );
  }

  if (error || !voting) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Голосование не найдено'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>{voting.title}</Text>
      </View>

      <Image
        source={{ uri: getFileUrl(voting.image) }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.description}>{voting.description}</Text>

        <View style={styles.authorInfo}>
          <Image
            source={{ uri: voting.createdBy.avatar || 'https://via.placeholder.com/32' }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>
            {voting.createdBy.firstName} {voting.createdBy.lastName}
          </Text>
          <Text style={styles.dateText}>{new Date(voting.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Варианты выбора</Text>
          {voting.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selectedOption === index && styles.selectedOption,
                voting?.userVoted && styles.votedOption
              ]}
              onPress={() => !voting?.userVoted && setSelectedOption(index)}
              disabled={voting?.userVoted || loading}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionText}>{option.text}</Text>
                <Text style={styles.votesCount}>{option.votes} голосов</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(option.votes / voting.totalVotes) * 100}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {!voting?.userVoted && (
          <TouchableOpacity
            style={[styles.voteButton, (selectedOption === null || loading) && styles.disabledButton]}
            onPress={handleVote}
            disabled={selectedOption === null || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.voteButtonText}>Проголосовать</Text>
            )}
          </TouchableOpacity>
        )}

        {voting?.userVoted && (
          <View style={styles.votedMessage}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.votedMessageText}>Спасибо за ваш голос!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#000',
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionItem: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#333' : '#eee',
  },
  selectedOption: {
    borderColor: '#6A1B9A',
    borderWidth: 2,
  },
  votedOption: {
    opacity: 0.7,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    flex: 1,
    marginRight: 8,
  },
  votesCount: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A1B9A',
  },
  voteButton: {
    backgroundColor: '#6A1B9A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  votedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    borderRadius: 8,
  },
  votedMessageText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  errorText: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    textAlign: 'center',
    marginTop: 24,
  },
}); 