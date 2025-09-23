import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ua from './locales/ua.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ua: { translation: ua },
  pl: { translation: pl },
  ru: { translation: ru },
} as const;

export const supportedLngs = ['en', 'ua', 'pl', 'ru'] as const;

export function setupI18n(initialLng?: string) {
  const device = Localization.getLocales?.()[0]?.languageCode ?? 'en';
  const fallback = (supportedLngs as readonly string[]).includes(device) ? device : 'en';

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLng || fallback,
    fallbackLng: 'en',
    // i18next v25 ожидает 'v4' (или можно удалить строку вовсе)
    compatibilityJSON: 'v4',
    interpolation: { escapeValue: false },
    supportedLngs: Array.from(supportedLngs),
  });

  return i18n;
}

export default i18n;
