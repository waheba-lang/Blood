import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'ar'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

document.documentElement.lang = i18n.language.startsWith('ar') ? 'ar' : 'fr';
document.documentElement.dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';

// Handle RTL direction change
i18n.on('languageChanged', (lng) => {
  const ar = lng.startsWith('ar');
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  document.documentElement.lang = ar ? 'ar' : 'fr';
});

export default i18n;
