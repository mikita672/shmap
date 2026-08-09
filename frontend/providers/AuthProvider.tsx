import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  setOnSignOut,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/lib/api/client";
import { logoutUser } from "@/lib/api/auth";
import type { AuthenticationResponse } from "@/lib/types/api";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (response: AuthenticationResponse) => Promise<void>;
  signUp: (response: AuthenticationResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

function onAppStateChange(status: AppStateStatus): void {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY).then((token) => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  const signOut = useCallback(async () => {
    await logoutUser().catch(console.warn);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    queryClient.clear();
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setOnSignOut(signOut);
  }, [signOut]);

  const handleAuth = useCallback(async (response: AuthenticationResponse) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refresh_token);
    setIsAuthenticated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated,
      signIn: handleAuth,
      signUp: handleAuth,
      signOut,
    }),
    [isLoading, isAuthenticated, handleAuth, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
}
