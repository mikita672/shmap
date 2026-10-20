import { apiClient } from "./client";
import type { BlockedUserResponse } from "@/lib/types/api";

export const getBlockedUsers = () =>
  apiClient.get<BlockedUserResponse[]>("/api/v1/blocks");

export const blockUser = (userId: number) =>
  apiClient.put<void>(`/api/v1/blocks/${userId}`);

export const unblockUser = (userId: number) =>
  apiClient.delete<void>(`/api/v1/blocks/${userId}`);
