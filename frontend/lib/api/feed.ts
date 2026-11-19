import { apiClient } from "./client";
import type { FeedPageResponse } from "@/lib/types/api";

export const getFeed = (cursor: string | null) =>
  apiClient.get<FeedPageResponse>("/api/v1/feed", {
    params: { cursor: cursor ?? undefined },
  });
