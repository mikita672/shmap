export const AuthErrorCode = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  USERNAME_ALREADY_EXISTS: "USERNAME_ALREADY_EXISTS",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INVALID_OTP: "INVALID_OTP",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_MAX_ATTEMPTS_EXCEEDED: "OTP_MAX_ATTEMPTS_EXCEEDED",
  INVALID_GOOGLE_TOKEN: "INVALID_GOOGLE_TOKEN",
  GOOGLE_AUTH_FAILED: "GOOGLE_AUTH_FAILED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  code: AuthErrorCode | string;
  message: string;
  error?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
