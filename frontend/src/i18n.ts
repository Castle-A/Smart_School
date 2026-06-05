import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationDE from './locales/de/translation.json';

const resources = {
    fr: { translation: translationFR },
    en: { translation: translationEN },
    es: { translation: translationES },
    de: { translation: translationDE },
};

i18n
    .use(LanguageDetector) // Détecte la langue du navigateur
    .use(initReactI18next) // Passe i18n à react-i18next
    .init({
        resources,
        fallbackLng: 'fr', // Langue par défaut
        lng: localStorage.getItem('language') || 'fr', // Langue sauvegardée ou défaut

        interpolation: {
            escapeValue: false, // React échappe déjà les valeurs
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
