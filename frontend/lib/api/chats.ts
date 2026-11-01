import { apiClient } from "./client";
import type {
  ChatMessageResponse,
  ChatResponse,
  ChatSummaryResponse,
  ChatUnreadCountResponse,
  CreateGroupChatRequest,
  SendChatMessageRequest,
} from "@/lib/types/api";

export const getChats = () =>
  apiClient.get<ChatSummaryResponse[]>("/api/v1/chats");

export const getUnreadChatCount = () =>
  apiClient.get<ChatUnreadCountResponse>("/api/v1/chats/unread/count");

export const markChatRead = (chatId: number, messageId: number) =>
  apiClient.put<void>(`/api/v1/chats/${chatId}/read`, { messageId });

export const getChat = (chatId: number) =>
  apiClient.get<ChatResponse>(`/api/v1/chats/${chatId}`);

export const openDirectChat = (userId: number) =>
  apiClient.put<ChatResponse>(`/api/v1/chats/direct/${userId}`);

export const getChatMessages = (chatId: number, before: number | null) =>
  apiClient.get<ChatMessageResponse[]>(`/api/v1/chats/${chatId}/messages`, {
    params: { before: before ?? undefined },
  });

export const sendChatMessage = (
  chatId: number,
  content: SendChatMessageRequest,
) =>
  apiClient.post<ChatMessageResponse>(
    `/api/v1/chats/${chatId}/messages`,
    content,
  );

export const createGroupChat = (data: CreateGroupChatRequest) =>
  apiClient.post<ChatResponse>("/api/v1/chats/groups", data);

export const addChatMembers = (chatId: number, userIds: number[]) =>
  apiClient.post<ChatResponse>(`/api/v1/chats/${chatId}/members`, {
    userIds,
  });

export const leaveChat = (chatId: number) =>
  apiClient.delete<void>(`/api/v1/chats/${chatId}/members/me`);
