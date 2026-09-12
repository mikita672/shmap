import { apiClient } from "./client";
import type {
  AuthenticationRequest,
  AuthenticationResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  MessageResponse,
} from "@/lib/types/api";

export const loginUser = (data: AuthenticationRequest) =>
  apiClient.post<AuthenticationResponse>("/api/v1/auth/authenticate", data);

export const registerUser = (data: RegisterRequest) =>
  apiClient.post<AuthenticationResponse>("/api/v1/auth/register", data);

export const verifyGoogleToken = (idToken: string) =>
  apiClient.post<AuthenticationResponse>("/api/v1/auth/verify-google", {
    idToken,
  });

export const logoutUser = () => apiClient.post("/api/v1/auth/logout");

export const forgotPassword = (data: ForgotPasswordRequest) =>
  apiClient.post<MessageResponse>("/api/v1/auth/forgot-password", data);

export const verifyOtp = (data: VerifyOtpRequest) =>
  apiClient.post<MessageResponse>("/api/v1/auth/verify-otp", data);

export const resetPassword = (data: ResetPasswordRequest) =>
  apiClient.post<MessageResponse>("/api/v1/auth/reset-password", data);
