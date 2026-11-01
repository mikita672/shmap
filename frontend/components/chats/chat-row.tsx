import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GroupAvatar } from "@/components/ui/group-avatar";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 52;

export interface ChatRowProps {
  name: string;
  preview: string;
  time?: string;
  isGroup: boolean;
  avatarUrl?: string | null;
  unreadCount?: number;
  divider?: boolean;
  onPress?: () => void;
}

export function ChatRow({
  name,
  preview,
  time,
  isGroup,
  avatarUrl,
  unreadCount = 0,
  divider = true,
  onPress,
}: ChatRowProps) {
  const isUnread = unreadCount > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className="h-[76px] flex-row items-center gap-3 px-4 active:opacity-80"
    >
      {isGroup ? (
        <GroupAvatar size={AVATAR_SIZE} />
      ) : (
        <Avatar uri={avatarUrl} size={AVATAR_SIZE} tone="surface" />
      )}

      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="flex-1 text-base font-medium leading-6 text-chat-list-foreground"
          >
            {name}
          </Text>
          {time ? (
            <Text
              className={cn(
                "text-xs leading-4",
                isUnread
                  ? "font-medium text-chat-list-unread"
                  : "text-secondary",
              )}
            >
              {time}
            </Text>
          ) : null}
        </View>
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className={cn(
              "flex-1 text-sm leading-5",
              isUnread ? "text-chat-list-foreground" : "text-secondary",
            )}
          >
            {preview}
          </Text>
          {isUnread && (
            <View
              accessible
              accessibilityLabel={`${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}`}
            >
              <Badge count={unreadCount} />
            </View>
          )}
        </View>
      </View>

      {divider && (
        <View className="absolute bottom-0 left-[84px] right-4 h-px bg-chat-list-divider" />
      )}
    </Pressable>
  );
}
