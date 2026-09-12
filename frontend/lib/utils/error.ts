import { AxiosError } from "axios";
import { AuthErrorCode, type ApiErrorResponse } from "@/lib/types/api";

const ALLOWED_FIELD_KEYS = new Set([
  "email",
  "password",
  "otp",
  "newPassword",
  "firstname",
  "lastname",
  "username",
]);

function sanitizeFieldErrors(
  raw: Record<string, unknown>,
): Record<string, string> | undefined {
  const result: Record<string, string> = {};
  for (const key of Object.keys(raw)) {
    if (ALLOWED_FIELD_KEYS.has(key) && typeof raw[key] === "string") {
      result[key] = raw[key] as string;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export function extractApiError(error: unknown): ApiErrorResponse | null {
  if (!error) return null;

  if (error instanceof AxiosError) {
    if (!error.response) {
      return {
        status: 0,
        code: "NETWORK_ERROR",
        message:
          "Unable to connect to the server. Please check your internet connection.",
        error:
          "Unable to connect to the server. Please check your internet connection.",
      };
    }

    const data = error.response.data;

    if (data && typeof data === "object") {
      const status =
        typeof data.status === "number" ? data.status : error.response.status;
      const code =
        data.code ??
        (status === 401
          ? AuthErrorCode.INVALID_CREDENTIALS
          : status === 409
            ? AuthErrorCode.EMAIL_ALREADY_EXISTS
            : "API_ERROR");

      const message =
        typeof data.message === "string" && data.message
          ? data.message
          : typeof data.error === "string" && data.error
            ? data.error
            : error.message || "Request failed";

      return {
        timestamp: data.timestamp,
        status,
        code,
        message,
        error: typeof data.error === "string" ? data.error : message,
        path: data.path,
        fieldErrors:
          data.fieldErrors && typeof data.fieldErrors === "object"
            ? sanitizeFieldErrors(data.fieldErrors)
            : undefined,
      };
    }

    if (typeof data === "string" && data.trim()) {
      return {
        status: error.response.status,
        code: "SERVER_ERROR",
        message: data.trim(),
        error: data.trim(),
      };
    }

    return {
      status: error.response.status,
      code: "SERVER_ERROR",
      message: error.message || "An unexpected server error occurred",
      error: error.message || "An unexpected server error occurred",
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      code: "CLIENT_ERROR",
      message: error.message,
      error: error.message,
    };
  }

  return {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: String(error),
    error: String(error),
  };
}

export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  const apiError = extractApiError(error);
  return apiError?.message || fallback;
}

export function getFieldErrorMessage(
  error: unknown,
  field: string,
): string | undefined {
  const apiError = extractApiError(error);
  return apiError?.fieldErrors?.[field];
}

export function isErrorCode(
  error: unknown,
  code: AuthErrorCode | string,
): boolean {
  const apiError = extractApiError(error);
  return apiError?.code === code;
}
