import { Pressable, Text as RNText } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";

export interface ActivityItemProps {
  name: string;
  action: string;
  time: string;
  avatarUrl?: string | null;
  onPress?: () => void;
}

export function ActivityItem({
  name,
  action,
  time,
  avatarUrl,
  onPress,
}: ActivityItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className="flex-row items-center gap-3 py-1 pl-3 pr-5 active:opacity-80"
    >
      <Avatar uri={avatarUrl} size={36} />
      <Text className="flex-1 text-sm leading-5 tracking-[0.5px] text-action-foreground">
        <RNText className="font-medium">{name}</RNText> {action}
      </Text>
      <Text className="text-sm leading-5 tracking-[0.5px] text-secondary">
        {time}
      </Text>
    </Pressable>
  );
}
