import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeName } from '@/core/hooks/useTheme';
import { DARK_THEME } from '@/core/hooks/useTheme';

const languages = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'tt', label: 'Татарча' },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const theme = useThemeName();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme === DARK_THEME ? '#fff' : '#222' }]}>{t('common.language')}:</Text>
      <View style={styles.buttonContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              { 
                backgroundColor: i18n.language === lang.code 
                  ? '#007AFF' 
                  : theme === DARK_THEME ? '#333' : '#eee',
                borderColor: theme === DARK_THEME ? '#444' : '#ccc'
              },
            ]}
            onPress={() => i18n.changeLanguage(lang.code)}
          >
            <Text
              style={[
                styles.buttonText,
                { 
                  color: i18n.language === lang.code 
                    ? '#fff' 
                    : theme === DARK_THEME ? '#fff' : '#222'
                },
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 