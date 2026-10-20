import { View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { mutualFriendsLabel } from "@/lib/mutual-friends";
import type { UserSummaryResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const MAX_AVATARS = 3;

export interface MutualFriendsPreviewProps {
  count: number;
  users?: UserSummaryResponse[];
  className?: string;
}

export function MutualFriendsPreview({
  count,
  users,
  className,
}: MutualFriendsPreviewProps) {
  const avatarCount = Math.min(count, MAX_AVATARS);

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <View className="flex-row">
        {Array.from({ length: avatarCount }, (_, index) => (
          <Avatar
            key={index}
            uri={users?.[index]?.avatarUrl}
            size={28}
            className={cn("border-2 border-background", index > 0 && "-ml-2")}
          />
        ))}
      </View>
      <Text className="text-sm font-medium leading-5 tracking-[0.5px] text-action-foreground">
        {mutualFriendsLabel(count)}
      </Text>
    </View>
  );
}
