import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { API_BASE_URL } from "@/lib/config";
import type { AuthenticationResponse } from "@/lib/types/api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

type SessionClearCallback = () => void;
let onSessionClear: SessionClearCallback | null = null;

export function setOnSessionClear(callback: SessionClearCallback): void {
  onSessionClear = callback;
}

export function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    let noRefreshToken = false;
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        noRefreshToken = true;
        throw new Error("No refresh token available");
      }

      const { data } = await refreshClient.post<AuthenticationResponse>(
        "/api/v1/auth/refresh-token",
        null,
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      );

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.access_token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);

      return data.access_token;
    } catch (error) {
      const isAuthRejection =
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403);

      if (noRefreshToken || isAuthRejection) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        onSessionClear?.();
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest.url?.includes("/authenticate") ||
      originalRequest.url?.includes("/register") ||
      originalRequest.url?.includes("/verify-google") ||
      originalRequest.url?.includes("/logout") ||
      originalRequest.url?.includes("/forgot-password") ||
      originalRequest.url?.includes("/verify-otp") ||
      originalRequest.url?.includes("/reset-password");

    const shouldAttemptRefresh =
      status === 401 && !originalRequest._retry && !isAuthEndpoint;

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export { apiClient, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
