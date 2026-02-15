import { useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { colorSchemeAtom, setColorSchemeAtom } from "@/atoms/theme-atom";

export function useTheme() {
  const [colorScheme] = useAtom(colorSchemeAtom);
  const setColorScheme = useSetAtom(setColorSchemeAtom);

  const toggleTheme = useCallback(() => {
    const newTheme: "light" | "dark" = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newTheme);
  }, [colorScheme, setColorScheme]);

  const isDark = colorScheme === "dark";

  const theme = useMemo(
    () => ({
      colorScheme,
      isDark,
      toggleTheme,
      setColorScheme,
    }),
    [colorScheme, isDark, toggleTheme, setColorScheme]
  );

  return theme;
}
