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
  createdAt: string;
  status: 'active' | 'ended';
};

const mockMyVotings: Voting[] = [
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
    createdAt: '2024-03-20',
    status: 'active',
  },
  {
    id: '2',
    title: 'Выбор цвета фасада дома',
    description: 'Голосование за цвет фасада нашего дома',
    image: 'https://example.com/house.jpg',
    options: [
      { id: '2-1', text: 'Бежевый', votes: 78 },
      { id: '2-2', text: 'Голубой', votes: 45 },
      { id: '2-3', text: 'Зеленый', votes: 32 },
    ],
    totalVotes: 155,
    createdAt: '2024-03-15',
    status: 'ended',
  },
];

export default function MyVotingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  const filteredVotings = mockMyVotings.filter(voting =>
    voting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voting.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои голосования</Text>
      </View>

      <ScrollView style={styles.votingsContainer}>
        {filteredVotings.map((voting) => (
          <Card key={voting.id} style={styles.votingCard}>
            <Card.Content>
              <View style={styles.votingHeader}>
                <Text style={styles.votingTitle}>{voting.title}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: voting.status === 'active' ? '#4CAF50' : '#9E9E9E' }
                ]}>
                  <Text style={styles.statusText}>
                    {voting.status === 'active' ? 'Активно' : 'Завершено'}
                  </Text>
                </View>
              </View>

              <Image
                source={{ uri: voting.image }}
                style={styles.votingImage}
                resizeMode="cover"
              />
              
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
                <Text style={styles.dateText}>Создано: {voting.createdAt}</Text>
                <Text style={styles.totalVotes}>Всего голосов: {voting.totalVotes}</Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push({
                    pathname: '/services/voting',
                    params: {
                      id: voting.id.toString(),
                    },
                  })}
                >
                  <MaterialCommunityIcons name="eye" size={20} color="#6A1B9A" />
                  <Text style={styles.actionText}>Просмотр</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ))}
        <View style={{ height: 80 }}></View>
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
  votingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  votingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  votingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  totalVotes: {
    fontSize: 12,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#333' : '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    color: '#6A1B9A',
    fontSize: 14,
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