import { apiClient } from "./client";
import type { FriendResponse } from "@/lib/types/api";

export const getFriends = () =>
  apiClient.get<FriendResponse[]>("/api/v1/friends");
