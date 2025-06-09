import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ru from './locales/ru.json';
import en from './locales/en.json';
import tt from './locales/tt.json';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  tt: { translation: tt },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // язык по умолчанию
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 