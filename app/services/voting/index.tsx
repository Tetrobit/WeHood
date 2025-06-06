import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import { Theme, useTheme } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

export default function VotingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredVotings = mockVotings.filter(voting =>
    voting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voting.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Голосования</Text>
      </View>

      <ScrollView style={styles.votingsContainer}>
        {filteredVotings.map((voting) => (
          <Card key={voting.id} style={styles.votingCard}>
            <Card.Content>
              <Image
                source={{ uri: voting.image }}
                style={styles.votingImage}
                resizeMode="cover"
              />
              <Text style={styles.votingTitle}>{voting.title}</Text>
              <Text style={styles.votingDescription}>{voting.description}</Text>
              
              <View style={styles.optionsContainer}>
                {voting.options.map((option) => (
                  <View key={option.id} style={styles.optionItem}>
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
                  </View>
                ))}
              </View>

              <View style={styles.votingFooter}>
                <View style={styles.authorInfo}>
                  <Image
                    source={{ uri: voting.author.avatar }}
                    style={styles.authorAvatar}
                  />
                  <Text style={styles.authorName}>{voting.author.name}</Text>
                </View>
                <Text style={styles.dateText}>{voting.createdAt}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/services/voting/new')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    borderRadius: 8,
  },
  votingsContainer: {
    flex: 1,
    padding: 16,
  },
  votingCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  votingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  votingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  votingDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  votesCount: {
    fontSize: 12,
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
  votingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  dateText: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
}); 