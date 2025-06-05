import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, TextInput, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { useTheme, Theme } from '@/core/hooks/useTheme';

type FormData = {
  childName: string;
  childAge: string;
  parentName: string;
  phone: string;
  email: string;
  preferredSchedule: string;
  additionalInfo: string;
};

export default function ApplyScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    childName: '',
    childAge: '',
    parentName: '',
    phone: '',
    email: '',
    preferredSchedule: '',
    additionalInfo: ''
  });

  const handleAIAssist = () => {
    setIsLoading(true);
    // Здесь будет интеграция с ИИ для автозаполнения формы
    setTimeout(() => {
      setFormData({
        childName: 'Анна Иванова',
        childAge: '7',
        parentName: 'Мария Иванова',
        phone: '+7 (999) 123-45-67',
        email: 'maria@example.com',
        preferredSchedule: 'Вечернее время после 17:00',
        additionalInfo: 'Есть опыт занятий танцами 1 год'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    // Здесь будет отправка формы
    console.log('Form submitted:', formData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Подать заявку</Text>
        <Text style={styles.subtitle}>
          Заполните форму самостоятельно или воспользуйтесь помощью ИИ
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content style={styles.formContent}>
          <Button
            mode="contained"
            onPress={handleAIAssist}
            loading={isLoading}
            icon="robot"
            style={styles.aiButton}
          >
            Заполнить с помощью ИИ
          </Button>

          <TextInput
            label="Имя ребенка"
            value={formData.childName}
            onChangeText={(text) => setFormData({ ...formData, childName: text })}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Возраст ребенка"
            value={formData.childAge}
            onChangeText={(text) => setFormData({ ...formData, childAge: text })}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="ФИО родителя"
            value={formData.parentName}
            onChangeText={(text) => setFormData({ ...formData, parentName: text })}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Телефон"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Предпочтительное время занятий"
            value={formData.preferredSchedule}
            onChangeText={(text) => setFormData({ ...formData, preferredSchedule: text })}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Дополнительная информация"
            value={formData.additionalInfo}
            onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            icon="send"
          >
            Отправить заявку
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  subtitle: {
    fontSize: 16,
    color: theme === 'dark' ? '#ccc' : '#666',
    marginBottom: 16,
  },
  formCard: {
    margin: 16,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
  },
  formContent: {
    gap: 16,
  },
  input: {
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
  },
  aiButton: {
    marginBottom: 16,
    backgroundColor: '#9C27B0',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
}); 