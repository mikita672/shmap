import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  formatDoneTitle,
  formatParticipants,
  formatVisibility,
} from "@/lib/route-format";
import type { RouteCompletionResponse } from "@/lib/types/api";

const MAX_AVATARS = 3;

export interface DoneCardProps {
  completion: RouteCompletionResponse;
  myId?: number;
  onPress?: () => void;
}

export function DoneCard({ completion, myId, onPress }: DoneCardProps) {
  const { line, note } = formatVisibility(completion);
  const limited = note !== null;
  const people = completion.participants.slice(0, MAX_AVATARS);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? "Edit finished route details" : undefined}
      className="gap-2.5 rounded-[20px] bg-action p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-2">
        <MaterialIcons
          name="check-circle"
          size={24}
          className="text-secondary"
        />
        <Text className="flex-1 text-base font-medium leading-6 text-action-foreground">
          {formatDoneTitle(completion.finishedOn)}
        </Text>
        {onPress && (
          <MaterialIcons name="edit" size={20} className="text-picker-ring" />
        )}
      </View>

      <View className="flex-row items-center gap-2.5">
        <View className="flex-row">
          {people.map((user, index) => (
            <View
              key={user.id}
              className={
                index > 0
                  ? "-ml-2 rounded-full bg-action p-0.5"
                  : "rounded-full bg-action p-0.5"
              }
            >
              <Avatar uri={user.avatarUrl} size={24} tone="surface" />
            </View>
          ))}
        </View>
        <Text
          numberOfLines={1}
          className="flex-1 text-sm leading-5 text-action-foreground"
        >
          {formatParticipants(completion.participants, myId)}
        </Text>
      </View>

      <View className="flex-row items-start gap-2">
        <MaterialIcons
          name={limited ? "lock" : "group"}
          size={18}
          className="text-secondary"
        />
        <View className="flex-1">
          <Text className="text-[13px] leading-4 text-secondary">{line}</Text>
          {note && (
            <Text className="text-[13px] leading-4 text-secondary">{note}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
