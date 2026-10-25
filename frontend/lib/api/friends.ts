import { apiClient } from "./client";
import type { FriendResponse } from "@/lib/types/api";

export const getFriends = () =>
  apiClient.get<FriendResponse[]>("/api/v1/friends");

export const addFavorite = (friendId: number) =>
  apiClient.put<void>(`/api/v1/friends/${friendId}/favorite`);

export const removeFavorite = (friendId: number) =>
  apiClient.delete<void>(`/api/v1/friends/${friendId}/favorite`);

export const muteFriend = (friendId: number) =>
  apiClient.put<void>(`/api/v1/friends/${friendId}/mute`);

export const unmuteFriend = (friendId: number) =>
  apiClient.delete<void>(`/api/v1/friends/${friendId}/mute`);

export const removeFriend = (friendId: number) =>
  apiClient.delete<void>(`/api/v1/friends/${friendId}`);
