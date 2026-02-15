import { atom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "@ispeak_theme";

// Base atom for storing the theme value
const baseThemeAtom = atom<"light" | "dark">("light");

// Read-only derived atom
export const colorSchemeAtom = atom<"light" | "dark">((get) => get(baseThemeAtom));

// Write-only derived atom for persistence
export const setColorSchemeAtom = atom(null, async (_get, set, newTheme: "light" | "dark") => {
  set(baseThemeAtom, newTheme);
  await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
});
