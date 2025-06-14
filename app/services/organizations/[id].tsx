import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useTheme, Theme } from "@/core/hooks/useTheme";
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const demoOrganizations = [
  {
    id: '1',
    title: 'Городская поликлиника №1',
    category: 'Медицинские организации',
    description: 'Многопрофильная поликлиника с широким спектром медицинских услуг. Предоставляем услуги по всем основным направлениям медицины. У нас работают квалифицированные специалисты с многолетним опытом.',
    image: 'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
    address: 'ул. Ленина, 10',
    phone: '+7 (999) 111-22-33',
    workingHours: 'Пн-Пт: 8:00-20:00',
    services: [
      'Терапия',
      'Педиатрия',
      'Стоматология',
      'Офтальмология',
      'Лабораторные исследования'
    ],
    website: 'https://example.com/clinic1'
  },
  {
    id: '2',
    title: 'Кафе "Уютное место"',
    category: 'Малый бизнес',
    description: 'Уютное кафе с домашней кухней и приятной атмосферой. Мы предлагаем широкий выбор блюд европейской и русской кухни, а также разнообразные десерты и напитки.',
    image: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg',
    address: 'пр. Мира, 25',
    phone: '+7 (999) 222-33-44',
    workingHours: 'Ежедневно: 9:00-23:00',
    services: [
      'Завтраки',
      'Бизнес-ланчи',
      'Ужины',
      'Детское меню',
      'Доставка'
    ],
    website: 'https://example.com/cafe1'
  },
  {
    id: '3',
    title: 'Детский сад "Солнышко"',
    category: 'Образование',
    description: 'Частный детский сад с развивающими программами. Мы создаем безопасную и комфортную среду для развития вашего ребенка.',
    image: 'https://img.freepik.com/free-photo/children-playing-kindergarten_23-2148634434.jpg',
    address: 'ул. Пушкина, 15',
    phone: '+7 (999) 333-44-55',
    workingHours: 'Пн-Пт: 7:00-19:00',
    services: [
      'Раннее развитие',
      'Подготовка к школе',
      'Английский язык',
      'Творческие занятия',
      'Спортивные секции'
    ],
    website: 'https://example.com/kindergarten1'
  },
  {
    id: '4',
    title: 'Фитнес-центр "Энергия"',
    category: 'Спорт и здоровье',
    description: 'Современный фитнес-центр с бассейном и тренажерным залом. Мы предлагаем широкий спектр программ для поддержания здоровья и красоты.',
    image: 'https://img.freepik.com/free-photo/fitness-trainer-with-dumbbells_23-2148331336.jpg',
    address: 'ул. Спортивная, 5',
    phone: '+7 (999) 444-55-66',
    workingHours: 'Ежедневно: 6:00-24:00',
    services: [
      'Тренажерный зал',
      'Бассейн',
      'Групповые занятия',
      'Персональные тренировки',
      'SPA-зона'
    ],
    website: 'https://example.com/fitness1'
  },
];

export default function OrganizationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  
  const organization = demoOrganizations.find(org => org.id === id);

  if (!organization) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Организация не найдена</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${organization.phone}`);
  };

  const handleWebsite = () => {
    Linking.openURL(organization.website);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.back()}
          style={styles.headerIcon}
          iconColor={theme === 'dark' ? '#fff' : '#000'}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={styles.title}>{organization.title}</Text>
        </View>
        <IconButton
          icon="phone"
          size={28}
          onPress={handleCall}
          style={styles.headerIcon}
          iconColor={theme === 'dark' ? '#fff' : '#000'}
        />
      </View>
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: organization.image }} style={styles.image} />
          <Card.Content>
            <Text style={styles.category}>{organization.category}</Text>
            <Text style={styles.description}>{organization.description}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Контактная информация</Text>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.infoText}>{organization.address}</Text>
              </View>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="phone" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.infoText}>{organization.phone}</Text>
              </View>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
                <Text style={styles.infoText}>{organization.workingHours}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Услуги</Text>
              {organization.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#FF6B6B" />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
              <Text style={styles.websiteButtonText}>Перейти на сайт</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 0,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    marginBottom: 16,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  category: {
    fontSize: 14,
    color: '#E91E63',
    marginTop: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    marginTop: 8,
    lineHeight: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  websiteButton: {
    backgroundColor: '#E91E63',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#000',
    textAlign: 'center',
    marginTop: 20,
  },
}); 