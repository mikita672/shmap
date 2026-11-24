import { apiClient } from "./client";
import type { FeedMapResponse, FeedPageResponse } from "@/lib/types/api";

export const getFeed = (cursor: string | null) =>
  apiClient.get<FeedPageResponse>("/api/v1/feed", {
    params: { cursor: cursor ?? undefined },
  });

export const getFeedMap = () =>
  apiClient.get<FeedMapResponse>("/api/v1/feed/map");
