import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

type Application = {
  id: string;
  activityName: string;
  childName: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  schedule: string;
};

const mockApplications: Application[] = [
  {
    id: '1',
    activityName: 'Школа танцев "Ритм"',
    childName: 'Анна Иванова',
    status: 'approved',
    date: '15.03.2024',
    schedule: 'Пн, Ср, Пт 16:00-17:30'
  },
  {
    id: '2',
    activityName: 'Футбольная секция "Чемпион"',
    childName: 'Петр Иванов',
    status: 'pending',
    date: '20.03.2024',
    schedule: 'Вт, Чт 15:00-16:30'
  },
  {
    id: '3',
    activityName: 'Художественная студия',
    childName: 'Мария Иванова',
    status: 'rejected',
    date: '10.03.2024',
    schedule: 'Ср, Сб 11:00-12:30'
  }
];

const statusConfig = {
  pending: {
    label: 'На рассмотрении',
    color: '#FFB300',
    icon: 'clock-outline'
  },
  approved: {
    label: 'Одобрено',
    color: '#4CAF50',
    icon: 'check-circle-outline'
  },
  rejected: {
    label: 'Отклонено',
    color: '#F44336',
    icon: 'close-circle-outline'
  }
};

export default function MyApplicationsScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои заявки</Text>
      </View>

      <ScrollView style={styles.applicationsContainer}>
        {mockApplications.map((application) => (
          <Card key={application.id} style={styles.applicationCard}>
            <Card.Content>
              <View style={styles.applicationHeader}>
                <Text style={styles.activityName}>{application.activityName}</Text>
                <Chip
                  icon={() => (
                    <MaterialCommunityIcons
                      name={statusConfig[application.status].icon as any}
                      size={16}
                      color={statusConfig[application.status].color}
                    />
                  )}
                  style={[styles.statusChip, { borderColor: statusConfig[application.status].color }]}
                  textStyle={[styles.statusText, { color: statusConfig[application.status].color }]}
                >
                  {statusConfig[application.status].label}
                </Chip>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="account" size={20} color="#666" />
                  <Text style={styles.detailText}>{application.childName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                  <Text style={styles.detailText}>Подана: {application.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{application.schedule}</Text>
                </View>
              </View>

              {application.status === 'approved' && (
                <Button
                  mode="contained"
                  onPress={() => router.push('/services/activities/contact')}
                  style={styles.actionButton}
                  icon="phone"
                >
                  Связаться с администрацией
                </Button>
              )}

              {application.status === 'rejected' && (
                <Button
                  mode="contained"
                  onPress={() => {}}
                  style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                  icon="refresh"
                >
                  Подать повторно
                </Button>
              )}
            </Card.Content>
          </Card>
        ))}
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
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  applicationsContainer: {
    padding: 16,
  },
  applicationCard: {
    marginBottom: 16,
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
    flex: 1,
    marginRight: 16,
  },
  statusChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: theme === DARK_THEME ? '#ccc' : '#666',
    flex: 1,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
  },
}); 