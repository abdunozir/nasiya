import { atom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_STORAGE_KEY = "@ispeak_language";

// Base atom for storing the language value
const baseLanguageAtom = atom<string>("en");

// Read-only derived atom
export const languageAtom = atom<string>((get) => get(baseLanguageAtom));

// Write-only derived atom for persistence
export const setLanguageAtom = atom(null, async (_get, set, newLanguage: string) => {
  set(baseLanguageAtom, newLanguage);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
});

// Helper function to initialize language from storage (call this in your app root)
export const initializeLanguageAtom = async (setAtom: (value: string) => void) => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      setAtom(savedLanguage);
    }
  } catch (error) {
    console.error("Failed to load language:", error);
  }
};
