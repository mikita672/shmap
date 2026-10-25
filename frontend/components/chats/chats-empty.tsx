import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ChatsEmptyProps {
  onNewGroup?: () => void;
}

export function ChatsEmpty({ onNewGroup }: ChatsEmptyProps) {
  return (
    <View className="flex-1 items-center justify-center px-12">
      <View className="items-center gap-2">
        <Text className="text-center text-xl leading-7 text-chat-list-foreground">
          No chats yet
        </Text>
        <Text className="text-center text-sm leading-5 text-secondary">
          Message a friend from their profile, or start a group to plan a route
          together
        </Text>
        <Pressable
          onPress={onNewGroup}
          disabled={!onNewGroup}
          accessibilityRole="button"
          className={cn(
            "flex-row items-center gap-2 px-3 py-2.5 active:opacity-60",
            !onNewGroup && "opacity-50",
          )}
        >
          <MaterialIcons
            name="group-add"
            size={24}
            className="text-chat-list-foreground"
          />
          <Text className="text-base font-medium leading-6 text-chat-list-foreground">
            New group
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
