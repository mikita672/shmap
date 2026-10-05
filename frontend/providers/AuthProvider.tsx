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
import type { Href } from "expo-router";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  setOnSessionClear,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/lib/api/client";
import { logoutUser } from "@/lib/api/auth";
import type { AuthenticationResponse } from "@/lib/types/api";

interface SignOutOptions {
  redirectTo?: Href;
}

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingRedirect: Href | null;
  signIn: (response: AuthenticationResponse) => Promise<void>;
  signUp: (response: AuthenticationResponse) => Promise<void>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  clearPendingRedirect: () => void;
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
  const [pendingRedirect, setPendingRedirect] = useState<Href | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
      .then((token) => {
        setIsAuthenticated(!!token);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn("Failed to load access token", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    queryClient.clear();
    setIsAuthenticated(false);
  }, []);

  const signOut = useCallback(
    async (options?: SignOutOptions) => {
      await logoutUser().catch(console.warn);
      setPendingRedirect(options?.redirectTo ?? null);
      await clearSession();
    },
    [clearSession],
  );

  const clearPendingRedirect = useCallback(() => setPendingRedirect(null), []);

  useEffect(() => {
    setOnSessionClear(clearSession);
  }, [clearSession]);

  const handleAuth = useCallback(async (response: AuthenticationResponse) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refresh_token);
    setIsAuthenticated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated,
      pendingRedirect,
      signIn: handleAuth,
      signUp: handleAuth,
      signOut,
      clearPendingRedirect,
    }),
    [
      isLoading,
      isAuthenticated,
      pendingRedirect,
      handleAuth,
      signOut,
      clearPendingRedirect,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
}
