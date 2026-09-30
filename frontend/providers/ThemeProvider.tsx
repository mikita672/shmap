import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";

export type ThemePreference = "light" | "dark" | "auto";

export interface ThemeContextValue {
  themePreference: ThemePreference;
  colorScheme: "light" | "dark";
  isDark: boolean;
  isLoading: boolean;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
}

export const THEME_STORAGE_KEY = "@shmap:theme-preference";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("auto");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadThemePreference() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          isMounted &&
          stored &&
          (stored === "light" || stored === "dark" || stored === "auto")
        ) {
          const pref = stored as ThemePreference;
          setThemePreferenceState(pref);
          setColorScheme(pref === "auto" ? "system" : pref);
        }
      } catch (error) {
        console.warn("Failed to load theme preference from storage", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadThemePreference();

    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  const setThemePreference = useCallback(
    async (preference: ThemePreference) => {
      setThemePreferenceState(preference);
      setColorScheme(preference === "auto" ? "system" : preference);

      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
      } catch (error) {
        console.warn("Failed to save theme preference to storage", error);
      }
    },
    [setColorScheme],
  );

  const resolvedScheme: "light" | "dark" =
    colorScheme === "dark" ? "dark" : "light";
  const isDark = resolvedScheme === "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      colorScheme: resolvedScheme,
      isDark,
      isLoading,
      setThemePreference,
    }),
    [themePreference, resolvedScheme, isDark, isLoading, setThemePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
