import { apiClient } from "./client";
import type {
  AuthenticationRequest,
  AuthenticationResponse,
  RegisterRequest,
} from "@/lib/types/api";

export const loginUser = (data: AuthenticationRequest) =>
  apiClient.post<AuthenticationResponse>("/api/v1/auth/authenticate", data);

export const registerUser = (data: RegisterRequest) =>
  apiClient.post<AuthenticationResponse>("/api/v1/auth/register", data);

export const logoutUser = () => apiClient.post("/api/v1/auth/logout");
