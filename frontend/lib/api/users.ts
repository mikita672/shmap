import { apiClient } from "./client";
import type {
  AuthenticationResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ProfileResponse,
  UpdateProfileRequest,
} from "@/lib/types/api";

export const getMe = () => apiClient.get<ProfileResponse>("/api/v1/users/me");

export const updateMe = (data: UpdateProfileRequest) =>
  apiClient.patch<ProfileResponse>("/api/v1/users/me", data);

export const changeEmail = (data: ChangeEmailRequest) =>
  apiClient.patch<AuthenticationResponse>("/api/v1/users/me/email", data);

export const changePassword = (data: ChangePasswordRequest) =>
  apiClient.patch<AuthenticationResponse>("/api/v1/users/me/password", data);
