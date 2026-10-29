import type { ChatMessageResponse, ChatSummaryResponse } from "@/lib/types/api";

export function getChatName(chat: ChatSummaryResponse) {
  if (chat.type === "GROUP") return chat.name;
  return `${chat.otherUser.firstName} ${chat.otherUser.lastName}`;
}

export function getMessagePreview(message: ChatMessageResponse) {
  if (message.type === "PLACE") return `📍 ${message.place.name}`;
  return message.text;
}

export function getChatPreview(chat: ChatSummaryResponse, myId?: number) {
  const message = chat.lastMessage;
  if (!message) return "No messages yet";
  const preview = getMessagePreview(message);
  if (message.sender.id === myId) return `You: ${preview}`;
  if (chat.type === "GROUP") return `${message.sender.firstName}: ${preview}`;
  return preview;
}
