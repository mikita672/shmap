import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { GroupAvatar } from "@/components/ui/group-avatar";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import type { ChatResponse } from "@/lib/types/api";

const AVATAR_SIZE = 44;

export interface ChatHeaderProps {
  chat?: ChatResponse;
  onMore?: () => void;
}

export function ChatHeader({ chat, onMore }: ChatHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="h-12 flex-row items-center gap-3 pl-2 pr-3"
      style={{ marginTop: insets.top + 6 }}
    >
      <BackButton className="relative" iconSize={40} />
      {chat && (
        <>
          {chat.type === "GROUP" ? (
            <GroupAvatar size={AVATAR_SIZE} />
          ) : (
            <Avatar uri={chat.members[0]?.avatarUrl} size={AVATAR_SIZE} />
          )}
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="text-[20px] leading-[26px] text-heading"
            >
              {getChatTitle(chat)}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[13px] leading-[18px] text-secondary"
            >
              {getChatSubtitle(chat)}
            </Text>
          </View>
          <RoundButton
            icon="more-vert"
            accessibilityLabel="Chat options"
            disabled={!onMore}
            onPress={onMore}
          />
        </>
      )}
    </View>
  );
}

function getChatTitle(chat: ChatResponse) {
  if (chat.type === "GROUP") return chat.name;
  const other = chat.members[0];
  return other ? `${other.firstName} ${other.lastName}` : "";
}

function getChatSubtitle(chat: ChatResponse) {
  if (chat.type === "GROUP") return `${chat.members.length + 1} members`;
  const other = chat.members[0];
  return other ? `@${other.username}` : "";
}
