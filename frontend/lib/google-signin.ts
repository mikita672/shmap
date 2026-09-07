/**
 * Thin wrapper around @react-native-google-signin/google-signin.
 *
 * @react-native-google-signin/google-signin requires a native binary
 * (RNGoogleSignin) that is NOT available in Expo Go. This module guards
 * the import so the app can still launch and run in Expo Go — Google Sign-In
 * will simply be disabled (button visible but non-functional with a clear
 * "unavailable" error).
 *
 * In a real development build or production build the real library is used.
 */

import Constants from "expo-constants";

const IS_EXPO_GO = Constants.appOwnership === "expo";

// ---------------------------------------------------------------------------
// Types (subset of what we actually use)
// ---------------------------------------------------------------------------

/** Mirrors SignInSuccessResponse from @react-native-google-signin/google-signin */
export type SignInSuccessResponse = {
  type: "success";
  data: {
    idToken: string | null;
    [key: string]: unknown;
  };
};

/** Mirrors CancelledResponse from @react-native-google-signin/google-signin */
export type SignInCancelledResponse = {
  type: "cancelled";
  data: null;
};

/** Mirrors SignInResponse from @react-native-google-signin/google-signin */
export type SignInResponse = SignInSuccessResponse | SignInCancelledResponse;

export type GoogleSigninType = {
  configure: (options: { webClientId?: string; iosClientId?: string }) => void;
  hasPlayServices: () => Promise<void>;
  signIn: () => Promise<SignInResponse>;
};

export type StatusCodesType = {
  SIGN_IN_CANCELLED: string;
  IN_PROGRESS: string;
  PLAY_SERVICES_NOT_AVAILABLE: string;
};

// ---------------------------------------------------------------------------
// Stub used in Expo Go
// ---------------------------------------------------------------------------

const GoogleSigninStub: GoogleSigninType = {
  configure: () => {},
  hasPlayServices: async () => {},
  signIn: async () => {
    throw new Error(
      "Google Sign-In is not available in Expo Go. Use a development build.",
    );
  },
};

const statusCodesStub: StatusCodesType = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
};

// ---------------------------------------------------------------------------
// Real module — only required when NOT in Expo Go to avoid the invariant
// violation that crashes the app.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _real: {
  GoogleSignin: GoogleSigninType;
  statusCodes: StatusCodesType;
} | null = null;

if (!IS_EXPO_GO) {
  // Dynamic require keeps Metro from evaluating the module at parse time in
  // environments where the native binary is absent (Expo Go).
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _real = require("@react-native-google-signin/google-signin");
}

export const GoogleSignin: GoogleSigninType = IS_EXPO_GO
  ? GoogleSigninStub
  : (_real!.GoogleSignin as GoogleSigninType);

export const statusCodes: StatusCodesType = IS_EXPO_GO
  ? statusCodesStub
  : (_real!.statusCodes as StatusCodesType);

/** True when running inside Expo Go — Google Sign-In will not work. */
export const isGoogleSigninUnavailable = IS_EXPO_GO;
