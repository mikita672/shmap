import { apiClient } from "./client";

export const blockUser = (userId: number) =>
  apiClient.put<void>(`/api/v1/blocks/${userId}`);
