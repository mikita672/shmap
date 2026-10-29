export type SendTarget =
  { kind: "group"; chatId: number } | { kind: "friend"; userId: number };

export function sendTargetKey(target: SendTarget) {
  return target.kind === "group"
    ? `group-${target.chatId}`
    : `friend-${target.userId}`;
}
