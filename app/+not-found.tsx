import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';
import { router } from 'expo-router';
import { useState } from 'react';

const memIds = [
  {
    image: require('@/assets/images/mem-face.png'),
    text: 'Бу! Испугался?',
    buttonText: 'Да',
    width: 200,
    height: 200
  },
  {
    image: require('@/assets/images/statham.png'),
    text: 'Я вам запрещаю сюда входить!',
    buttonText: 'Выйти отсюда',
    width: 200,
    height: 500
  }
];

export default function NotFoundScreen() {
  const theme = useThemeName();
  const styles = makeStyles(theme!);
  const [memId] = useState(Math.floor(Math.random() * memIds.length));

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={[styles.image, { width: memIds[memId].width, height: memIds[memId].height }]}
          source={memIds[memId].image}
        />
      </View>
      <Text style={styles.header}>{memIds[memId].text}</Text>
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.button}>
        <Text style={styles.buttonContent}>{memIds[memId].buttonText}</Text>
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
