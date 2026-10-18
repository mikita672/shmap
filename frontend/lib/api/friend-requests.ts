import { apiClient } from "./client";
import type {
  FriendRequestCountResponse,
  FriendRequestResponse,
  SendFriendRequestResponse,
} from "@/lib/types/api";

export const sendFriendRequest = (receiverId: number) =>
  apiClient.post<SendFriendRequestResponse>("/api/v1/friend-requests", {
    receiverId,
  });

export const getIncomingRequests = () =>
  apiClient.get<FriendRequestResponse[]>("/api/v1/friend-requests/incoming");

export const getSentRequests = () =>
  apiClient.get<FriendRequestResponse[]>("/api/v1/friend-requests/sent");

export const acceptFriendRequest = (requestId: number) =>
  apiClient.post<void>(`/api/v1/friend-requests/${requestId}/accept`);

export const declineFriendRequest = (requestId: number) =>
  apiClient.post<void>(`/api/v1/friend-requests/${requestId}/decline`);

export const cancelFriendRequest = (requestId: number) =>
  apiClient.delete<void>(`/api/v1/friend-requests/${requestId}`);

export const getIncomingRequestCount = () =>
  apiClient.get<FriendRequestCountResponse>(
    "/api/v1/friend-requests/incoming/count",
  );
