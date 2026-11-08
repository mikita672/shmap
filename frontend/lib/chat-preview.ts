import type {
  ChatMessageResponse,
  ChatResponse,
  ChatSummaryResponse,
} from "@/lib/types/api";

export function getChatName(chat: ChatSummaryResponse) {
  if (chat.type === "GROUP") return chat.name;
  return `${chat.otherUser.firstName} ${chat.otherUser.lastName}`;
}

export function getChatTitle(chat: ChatResponse) {
  if (chat.type === "GROUP") return chat.name;
  const other = chat.members[0];
  return other ? `${other.firstName} ${other.lastName}` : "";
}

export function getMessagePreview(message: ChatMessageResponse) {
  if (message.type === "PLACE") return `📍 ${message.place.name}`;
  if (message.type === "ROUTE") return `🗺️ ${message.route.name}`;
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
