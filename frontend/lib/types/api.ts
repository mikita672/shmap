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
  PRIVATE_ACCOUNT: "PRIVATE_ACCOUNT",
  FRIENDS_LIST_HIDDEN: "FRIENDS_LIST_HIDDEN",
  BLOCK_NOT_FOUND: "BLOCK_NOT_FOUND",
  CHAT_NOT_FOUND: "CHAT_NOT_FOUND",
  CHAT_MESSAGE_NOT_FOUND: "CHAT_MESSAGE_NOT_FOUND",
  NOT_FRIENDS: "NOT_FRIENDS",
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

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  privateAccount: boolean;
  friendsListHidden: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  privateAccount?: boolean;
  friendsListHidden?: boolean;
}

export interface ChangeEmailRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AvatarUploadRequest {
  contentType: string;
  contentLength: number;
}

export interface AvatarUploadResponse {
  uploadUrl: string;
  key: string;
  expiresAt: string;
}

export interface ConfirmAvatarRequest {
  key: string;
}

export interface UsernameAvailabilityResponse {
  username: string;
  available: boolean;
}

export interface FriendRequestCountResponse {
  count: number;
}

export interface UserSummaryResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface BlockedUserResponse {
  user: UserSummaryResponse;
  blockedAt: string;
}

export interface FriendRequestResponse {
  id: number;
  user: UserSummaryResponse;
  createdAt: string;
  mutualFriendsCount: number;
}

export type FriendActivityType = "REQUEST_ACCEPTED" | "NEW_FRIENDSHIP";

export interface FriendActivityResponse {
  id: number;
  type: FriendActivityType;
  user: UserSummaryResponse;
  createdAt: string;
}

export interface FriendResponse {
  user: UserSummaryResponse;
  favorite: boolean;
  muted: boolean;
  friendsSince: string;
}

export interface FriendSuggestionResponse {
  user: UserSummaryResponse;
  mutualFriendsCount: number;
}

export type SendFriendRequestResponse =
  | { outcome: "REQUEST_SENT"; requestId: number }
  | { outcome: "BECAME_FRIENDS"; requestId: null };

export type Relationship =
  "NONE" | "REQUESTED" | "INCOMING" | "FRIENDS" | "SELF";

export type UserSearchResultResponse = {
  user: UserSummaryResponse;
  mutualFriendsCount: number;
} & (
  | { relationship: "NONE" | "FRIENDS"; requestId: null }
  | { relationship: "REQUESTED" | "INCOMING"; requestId: number }
);

export type PublicProfileResponse = {
  user: UserSummaryResponse;
  bio: string | null;
  favorite: boolean;
  muted: boolean;
  friendsSince: string | null;
  mutualFriendsCount: number;
  previewOnly: boolean;
  friendsCount: number | null;
  friendsListVisible: boolean;
} & (
  | { relationship: "NONE" | "FRIENDS" | "SELF"; requestId: null }
  | { relationship: "REQUESTED" | "INCOMING"; requestId: number }
);

export type ChatType = "DIRECT" | "GROUP";

export interface ChatMessageResponse {
  id: number;
  sender: UserSummaryResponse;
  text: string;
  createdAt: string;
}

export type ChatSummaryResponse = {
  id: number;
  lastMessage: ChatMessageResponse | null;
  unreadCount: number;
} & (
  | { type: "DIRECT"; name: null; otherUser: UserSummaryResponse }
  | { type: "GROUP"; name: string; otherUser: null }
);

export type ChatResponse = {
  id: number;
  members: UserSummaryResponse[];
  canSend: boolean;
  lastReadMessageId: number | null;
} & ({ type: "DIRECT"; name: null } | { type: "GROUP"; name: string });

export interface ChatUnreadCountResponse {
  count: number;
}

export interface ChatReadEvent {
  chatId: number;
  lastReadMessageId: number;
  unreadCount: number;
  totalUnreadCount: number;
}

export interface CreateGroupChatRequest {
  name: string;
  memberIds: number[];
}
