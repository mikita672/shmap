import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/providers/AuthProvider";

function RootNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    // The 'dark' class on this View activates .dark:root CSS variables in global.css.
    // Without it, darkMode: "class" in tailwind.config.js has no effect on native.
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="index" />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
        <PortalHost />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
