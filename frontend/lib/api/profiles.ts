import { apiClient } from "./client";
import type { PublicProfileResponse } from "@/lib/types/api";

export const getPublicProfile = (username: string) =>
  apiClient.get<PublicProfileResponse>(
    `/api/v1/profiles/${encodeURIComponent(username)}`,
  );
