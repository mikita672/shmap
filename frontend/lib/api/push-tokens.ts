import { apiClient } from "./client";

export const registerPushToken = (token: string) =>
  apiClient.put<void>("/api/v1/push-tokens", { token });
