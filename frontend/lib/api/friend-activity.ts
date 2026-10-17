import { apiClient } from "./client";
import type { FriendActivityResponse } from "@/lib/types/api";

export const getFriendActivity = () =>
  apiClient.get<FriendActivityResponse[]>("/api/v1/friend-activity");
