import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';

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
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.button}>
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
