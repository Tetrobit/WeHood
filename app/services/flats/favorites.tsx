import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';

export default function FavoriteFlatsScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Избранные квартиры</Text>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === DARK_THEME ? '#111' : '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
}); 