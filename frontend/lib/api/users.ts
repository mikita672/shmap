import { apiClient } from "./client";
import type {
  AuthenticationResponse,
  AvatarUploadRequest,
  AvatarUploadResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ConfirmAvatarRequest,
  ProfileResponse,
  UpdateProfileRequest,
  UsernameAvailabilityResponse,
} from "@/lib/types/api";

export const getMe = () => apiClient.get<ProfileResponse>("/api/v1/users/me");

export const updateMe = (data: UpdateProfileRequest) =>
  apiClient.patch<ProfileResponse>("/api/v1/users/me", data);

export const changeEmail = (data: ChangeEmailRequest) =>
  apiClient.patch<AuthenticationResponse>("/api/v1/users/me/email", data);

export const changePassword = (data: ChangePasswordRequest) =>
  apiClient.patch<AuthenticationResponse>("/api/v1/users/me/password", data);

export const checkUsernameAvailability = (username: string) =>
  apiClient.get<UsernameAvailabilityResponse>(
    "/api/v1/users/me/username-availability",
    { params: { username } },
  );

export const createAvatarUploadUrl = (data: AvatarUploadRequest) =>
  apiClient.post<AvatarUploadResponse>(
    "/api/v1/users/me/avatar/upload-url",
    data,
  );

export const confirmAvatar = (data: ConfirmAvatarRequest) =>
  apiClient.post<ProfileResponse>("/api/v1/users/me/avatar/confirm", data);

export const removeAvatar = () =>
  apiClient.delete<ProfileResponse>("/api/v1/users/me/avatar");
