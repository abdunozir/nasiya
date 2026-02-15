import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../locales/en/translation.json";
import ru from "../locales/ru/translation.json";
import uz from "../locales/uz/translation.json";
import uzCyrl from "../locales/uz-Cyrl/translation.json";

const LANGUAGE_STORAGE_KEY = "@ispeak_language";

// Get saved language or use system default
const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      return savedLanguage;
    }
  } catch (error) {
    console.error("Failed to load language:", error);
  }
  return "en"; // Default to English
};

// Initialize i18n
i18n.use(initReactI18next).init({
  lng: "en", // Will be updated by the loaded language
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
    "uz-Cyrl": { translation: uzCyrl },
  },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged',
    bindI18nStore: 'added',
  },
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language and update i18n
getInitialLanguage().then((language) => {
  i18n.changeLanguage(language);
});

// Function to save and change language
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Failed to save language:", error);
  }
};

// Function to get current saved language
export const getSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage || "en";
  } catch (error) {
    console.error("Failed to get saved language:", error);
    return "en";
  }
};

export default i18n;
