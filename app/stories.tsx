import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import StoriesView from './components/StoriesView';

const carouselData = [
  {
    id: '1',
    title: 'Добро пожаловать в WeHood',
    description: 'Ваш районный помощник',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84',
  },
  {
    id: '2',
    title: 'Будьте активны',
    description: 'Участвуйте в жизни района',
    image: 'https://img.freepik.com/free-photo/people-attending-therapy-meeting_23-2151083315.jpg',
  },
  {
    id: '3',
    title: 'Помогайте соседям',
    description: 'Создавайте крепкое сообщество',
    image: 'https://img.freepik.com/free-photo/business-agreement-handshake-hand-gesture_53876-130006.jpg',
  },
];

export default function StoriesScreen() {
  const { initialIndex } = useLocalSearchParams<{ initialIndex: string }>();

  return (
    <View style={{ flex: 1 }}>
      <StoriesView
        stories={carouselData}
        initialIndex={parseInt(initialIndex || '0')}
      />
    </View>
  );
} 