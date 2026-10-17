import { apiClient } from "./client";
import type { FriendRequestCountResponse } from "@/lib/types/api";

export const getIncomingRequestCount = () =>
  apiClient.get<FriendRequestCountResponse>(
    "/api/v1/friend-requests/incoming/count",
  );
