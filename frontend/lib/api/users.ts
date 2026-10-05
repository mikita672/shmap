import { apiClient } from "./client";
import type { ProfileResponse } from "@/lib/types/api";

export const getMe = () => apiClient.get<ProfileResponse>("/api/v1/users/me");
