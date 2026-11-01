let openChatId: number | null = null;

export function setOpenChatId(chatId: number | null) {
  openChatId = chatId;
}

export function getOpenChatId() {
  return openChatId;
}
