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
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
  ROUTE_FULL: "ROUTE_FULL",
  ROUTE_STOP_NOT_FOUND: "ROUTE_STOP_NOT_FOUND",
  ROUTE_STOPS_CHANGED: "ROUTE_STOPS_CHANGED",
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

export interface ChatPlace {
  osmId: string | null;
  name: string;
  address: string | null;
  osmKey: string | null;
  osmValue: string | null;
  latitude: number;
  longitude: number;
}

export type SendChatMessageRequest = (
  { text: string } | { place: ChatPlace }
) & {
  clientId?: string;
};

export interface ChatRoute {
  id: number | null;
  name: string;
}

export type ChatMessageResponse = {
  id: number;
  sender: UserSummaryResponse;
  createdAt: string;
  clientId: string | null;
} & (
  | { type: "TEXT"; text: string; place: null; route: null }
  | { type: "PLACE"; text: null; place: ChatPlace; route: null }
  | { type: "ROUTE"; text: string | null; place: null; route: ChatRoute }
);

export type ChatSummaryResponse = {
  id: number;
  lastMessage: ChatMessageResponse | null;
  unreadCount: number;
  memberIds: number[];
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

export type TravelMode = "WALKING" | "DRIVING";

export type PathStatus =
  "NONE" | "PENDING" | "READY" | "NO_ROUTE" | "UNAVAILABLE";

export type RoutePathResponse =
  | {
      status: "READY";
      distanceMeters: number;
      durationSeconds: number;
      polyline: string;
    }
  | {
      status: Exclude<PathStatus, "READY">;
      distanceMeters: null;
      durationSeconds: null;
      polyline: null;
    };

export interface RouteStopResponse {
  id: number;
  place: ChatPlace;
  addedBy: UserSummaryResponse;
  addedAt: string;
}

export type RouteVisibility = "PARTICIPANTS" | "FRIENDS" | "EVERYONE";

export interface RouteCompletionResponse {
  finishedOn: string;
  visibility: RouteVisibility;
  effectiveVisibility: RouteVisibility;
  participants: UserSummaryResponse[];
}

export interface RouteResponse {
  id: number;
  chatId: number;
  name: string;
  travelMode: TravelMode;
  path: RoutePathResponse;
  createdBy: UserSummaryResponse;
  createdAt: string;
  updatedAt: string;
  member: boolean;
  canEdit: boolean;
  completion: RouteCompletionResponse | null;
  stops: RouteStopResponse[];
}

export interface RouteSummaryResponse {
  id: number;
  name: string;
  travelMode: TravelMode;
  stopCount: number;
  distanceMeters: number | null;
  durationSeconds: number | null;
  finishedOn: string | null;
  createdBy: UserSummaryResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteRequest {
  name: string;
  travelMode?: TravelMode;
  message?: string;
}

export interface RouteCompletionRequest {
  finishedOn: string;
  participantIds: number[];
  visibility: RouteVisibility;
}

export type UpdateRouteRequest =
  | { name: string; travelMode?: TravelMode }
  | { name?: string; travelMode: TravelMode };

export interface RouteEvent {
  chatId: number;
  routeId: number;
}
