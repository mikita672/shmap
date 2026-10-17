import { apiClient } from "./client";
import type { FriendSuggestionResponse } from "@/lib/types/api";

export const getFriendSuggestions = () =>
  apiClient.get<FriendSuggestionResponse[]>("/api/v1/friend-suggestions");
