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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

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
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
        <PortalHost />
        <Toaster position="bottom-center" />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
