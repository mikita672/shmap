import { enableFreeze } from "react-native-screens";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Stack,
} from "expo-router";

import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useChatEvents } from "@/hooks/useChatEvents";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider as AppThemeProvider } from "@/providers/ThemeProvider";
import { LogManager } from "@maplibre/maplibre-react-native";
import { useTheme } from "@/hooks/useTheme";

LogManager.onLog((log) => {
  const { message, tag } = log;
  if (
    tag === "Mbgl-LocationComponent" &&
    message.includes("Failed to obtain last location update")
  ) {
    return true;
  }
  return false;
});

enableFreeze(true);

function RootNavigator() {
  const { isDark } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  useChatEvents();

  if (isLoading) {
    return null;
  }

  return (
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="blocked-users" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="chat/[chatId]/index" />
            <Stack.Screen name="new-group/index" />
            <Stack.Screen
              name="scan"
              options={{ presentation: "fullScreenModal" }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Screen name="u/[username]" />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
        <PortalHost />
        <Toaster position="bottom-center" />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AppThemeProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
