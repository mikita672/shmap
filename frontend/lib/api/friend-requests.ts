import { apiClient } from "./client";
import type {
  FriendRequestCountResponse,
  FriendRequestResponse,
} from "@/lib/types/api";

export const getIncomingRequests = () =>
  apiClient.get<FriendRequestResponse[]>("/api/v1/friend-requests/incoming");

export const getIncomingRequestCount = () =>
  apiClient.get<FriendRequestCountResponse>(
    "/api/v1/friend-requests/incoming/count",
  );
