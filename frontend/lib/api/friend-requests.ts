import { apiClient } from "./client";
import type {
  FriendRequestCountResponse,
  FriendRequestResponse,
} from "@/lib/types/api";

export const getIncomingRequests = () =>
  apiClient.get<FriendRequestResponse[]>("/api/v1/friend-requests/incoming");

export const getSentRequests = () =>
  apiClient.get<FriendRequestResponse[]>("/api/v1/friend-requests/sent");

export const acceptFriendRequest = (requestId: number) =>
  apiClient.post<void>(`/api/v1/friend-requests/${requestId}/accept`);

export const declineFriendRequest = (requestId: number) =>
  apiClient.post<void>(`/api/v1/friend-requests/${requestId}/decline`);

export const getIncomingRequestCount = () =>
  apiClient.get<FriendRequestCountResponse>(
    "/api/v1/friend-requests/incoming/count",
  );
