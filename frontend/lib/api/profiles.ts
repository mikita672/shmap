import { apiClient } from "./client";
import type {
  PublicProfileResponse,
  UserSummaryResponse,
} from "@/lib/types/api";

export const getPublicProfile = (username: string) =>
  apiClient.get<PublicProfileResponse>(
    `/api/v1/profiles/${encodeURIComponent(username)}`,
  );

export const getProfileFriends = (username: string) =>
  apiClient.get<UserSummaryResponse[]>(
    `/api/v1/profiles/${encodeURIComponent(username)}/friends`,
  );

export const getMutualFriends = (username: string) =>
  apiClient.get<UserSummaryResponse[]>(
    `/api/v1/profiles/${encodeURIComponent(username)}/mutual-friends`,
  );
