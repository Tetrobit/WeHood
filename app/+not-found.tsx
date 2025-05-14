import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

type ServiceIcon = 'hand-heart' | 'calendar-star' | 'bullhorn' | 'account-group';

const mockNews = [
  {
    id: '1',
    title: 'Субботник в парке',
    description: 'В эту субботу состоится уборка территории парка. Приглашаем всех желающих!',
    time: '2 часа назад',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84',
  },
  {
    id: '2',
    title: 'Новая детская площадка',
    description: 'В нашем районе открылась современная детская площадка',
    time: '4 часа назад',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  },
];

const services: Array<{
  id: string;
  title: string;
  icon: ServiceIcon;
  color: string;
}> = [
  { id: '1', title: 'Помощь', icon: 'hand-heart', color: '#FF6B6B' },
  { id: '2', title: 'События', icon: 'calendar-star', color: '#4ECDC4' },
  { id: '3', title: 'Объявления', icon: 'bullhorn', color: '#FFD93D' },
  { id: '4', title: 'Соседи', icon: 'account-group', color: '#95E1D3' },
];

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
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  },
  {
    id: '3',
    title: 'Помогайте соседям',
    description: 'Создавайте крепкое сообщество',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
  },
];

export default function HomeScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require('@/assets/images/mem-face.png')}
        />
      </View>
      <Text style={styles.header}>Бу! Испугался?</Text>
      <TouchableOpacity activeOpacity={0.7} style={styles.button}>
        <Text style={styles.buttonContent}>Да</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 200,
    height: 200,
  },
  header: {
    fontSize: 20,
    marginBottom: 50,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: theme === DARK_THEME ? '#fff' : '#000',
  },
  buttonContent: {
    fontSize: 20,
    color: theme === DARK_THEME ? '#000' : '#fff'
  }
});
