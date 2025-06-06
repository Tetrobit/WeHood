import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

type Voting = {
  id: string;
  title: string;
  description: string;
  image: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
};

const mockVotings: Voting[] = [
  {
    id: '1',
    title: 'Выбор места для нового сквера',
    description: 'Голосование за место расположения нового сквера в нашем районе',
    image: 'https://example.com/park.jpg',
    options: [
      { id: '1-1', text: 'Улица Ленина, 15', votes: 45 },
      { id: '1-2', text: 'Проспект Мира, 8', votes: 32 },
      { id: '1-3', text: 'Площадь Свободы', votes: 28 },
    ],
    totalVotes: 105,
    author: {
      id: '1',
      name: 'Иван Петров',
      avatar: 'https://example.com/avatar1.jpg',
    },
    createdAt: '2024-03-20',
  },
];

export default function VotingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const voting = mockVotings.find(v => v.id === id);

  if (!voting) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Голосование не найдено</Text>
      </View>
    );
  }

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      // TODO: Отправить голос на сервер
      setHasVoted(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>{voting.title}</Text>
      </View>

      <Image
        source={{ uri: voting.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.description}>{voting.description}</Text>

        <View style={styles.authorInfo}>
          <Image
            source={{ uri: voting.author.avatar }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>{voting.author.name}</Text>
          <Text style={styles.dateText}>{voting.createdAt}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Варианты выбора</Text>
          {voting.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selectedOption === option.id && styles.selectedOption,
                hasVoted && styles.votedOption
              ]}
              onPress={() => !hasVoted && setSelectedOption(option.id)}
              disabled={hasVoted}
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

        {!hasVoted && (
          <TouchableOpacity
            style={[styles.voteButton, !selectedOption && styles.disabledButton]}
            onPress={handleVote}
            disabled={!selectedOption}
          >
            <Text style={styles.voteButtonText}>Проголосовать</Text>
          </TouchableOpacity>
        )}

        {hasVoted && (
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