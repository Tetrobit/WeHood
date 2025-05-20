import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type ContactMethod = {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
};

export default function ContactScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  const contactMethods: ContactMethod[] = [
    {
      id: '1',
      title: 'Позвонить',
      description: 'Быстрый способ получить ответ на ваши вопросы',
      icon: 'phone',
      action: () => Linking.openURL('tel:+78001234567'),
    },
    {
      id: '2',
      title: 'WhatsApp',
      description: 'Напишите нам в WhatsApp',
      icon: 'whatsapp',
      action: () => Linking.openURL('whatsapp://send?phone=78001234567'),
    },
    {
      id: '3',
      title: 'Telegram',
      description: 'Свяжитесь с нами через Telegram',
      icon: 'telegram',
      action: () => Linking.openURL('https://t.me/activities_admin'),
    },
    {
      id: '4',
      title: 'Email',
      description: 'Напишите нам на почту',
      icon: 'email',
      action: () => Linking.openURL('mailto:activities@wehood.com'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Связаться с администрацией</Text>
        <Text style={styles.subtitle}>
          Выберите удобный способ связи
        </Text>
      </View>

      <ScrollView style={styles.methodsContainer}>
        {contactMethods.map((method) => (
          <Card
            key={method.id}
            style={styles.methodCard}
            onPress={method.action}
          >
            <Card.Content style={styles.methodContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={32}
                  color="#007AFF"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666"
              />
            </Card.Content>
          </Card>
        ))}

        <Card style={[styles.methodCard, styles.workingHoursCard]}>
          <Card.Content>
            <Text style={styles.workingHoursTitle}>Часы работы</Text>
            <View style={styles.workingHoursContent}>
              <View style={styles.workingHoursRow}>
                <Text style={styles.dayText}>Пн-Пт:</Text>
                <Text style={styles.hoursText}>9:00 - 20:00</Text>
              </View>
              <View style={styles.workingHoursRow}>
                <Text style={styles.dayText}>Сб:</Text>
                <Text style={styles.hoursText}>10:00 - 18:00</Text>
              </View>
              <View style={styles.workingHoursRow}>
                <Text style={styles.dayText}>Вс:</Text>
                <Text style={styles.hoursText}>Выходной</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  subtitle: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#ccc' : '#666',
  },
  methodsContainer: {
    padding: 16,
  },
  methodCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme === DARK_THEME ? '#333' : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  methodDescription: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#ccc' : '#666',
  },
  workingHoursCard: {
    marginTop: 24,
  },
  workingHoursTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  workingHoursContent: {
    gap: 12,
  },
  workingHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#ccc' : '#666',
  },
  hoursText: {
    fontSize: 16,
    color: theme === DARK_THEME ? '#fff' : '#000',
    fontWeight: '500',
  },
}); 