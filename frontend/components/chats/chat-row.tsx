import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { GroupAvatar } from "@/components/ui/group-avatar";
import { Text } from "@/components/ui/text";

const AVATAR_SIZE = 52;

export interface ChatRowProps {
  name: string;
  preview: string;
  time?: string;
  isGroup: boolean;
  avatarUrl?: string | null;
  divider?: boolean;
  onPress?: () => void;
}

export function ChatRow({
  name,
  preview,
  time,
  isGroup,
  avatarUrl,
  divider = true,
  onPress,
}: ChatRowProps) {
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
            <Text className="text-xs leading-4 text-secondary">{time}</Text>
          ) : null}
        </View>
        <Text numberOfLines={1} className="text-sm leading-5 text-secondary">
          {preview}
        </Text>
      </View>

      {divider && (
        <View className="absolute bottom-0 left-[84px] right-4 h-px bg-chat-list-divider" />
      )}
    </Pressable>
  );
}
