import { apiClient } from "./client";
import type {
  FeedPageResponse,
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

export const getProfileRoutes = (username: string, cursor: string | null) =>
  apiClient.get<FeedPageResponse>(
    `/api/v1/profiles/${encodeURIComponent(username)}/routes`,
    { params: { cursor: cursor ?? undefined } },
  );
