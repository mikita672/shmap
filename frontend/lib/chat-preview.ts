import type { ChatSummaryResponse } from "@/lib/types/api";

export function getChatName(chat: ChatSummaryResponse) {
  if (chat.type === "GROUP") return chat.name;
  return `${chat.otherUser.firstName} ${chat.otherUser.lastName}`;
}

export function getChatPreview(chat: ChatSummaryResponse, myId?: number) {
  const message = chat.lastMessage;
  if (!message) return "No messages yet";
  if (message.sender.id === myId) return `You: ${message.text}`;
  if (chat.type === "GROUP")
    return `${message.sender.firstName}: ${message.text}`;
  return message.text;
}
