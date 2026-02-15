import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { colorSchemeAtom, setColorSchemeAtom } from "@/atoms/theme-atom";

const THEME_STORAGE_KEY = "@ispeak_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme] = useAtom(colorSchemeAtom);
  const setColorScheme = useSetAtom(setColorSchemeAtom);

  useEffect(() => {
    // Load saved theme on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          setColorScheme(savedTheme);
        } else if (systemColorScheme === "light" || systemColorScheme === "dark") {
          // Fall back to system theme if no saved theme
          setColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        // Fall back to system theme on error
        if (systemColorScheme === "light" || systemColorScheme === "dark") {
          setColorScheme(systemColorScheme);
        }
      }
    };

    loadTheme();
  }, [systemColorScheme, setColorScheme]);

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>;
}
