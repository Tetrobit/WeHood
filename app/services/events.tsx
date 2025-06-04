import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, useTheme } from '@/core/hooks/useTheme';

export default function EventsScreen() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>События и субботники</Text>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#111' : '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: theme === 'dark' ? '#fff' : '#000',
  },
}); 