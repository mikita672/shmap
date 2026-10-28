import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ChatsEmptyProps {
  title?: string;
  description?: string;
  onNewGroup?: () => void;
}

export function ChatsEmpty({
  title = "No chats yet",
  description = "Message a friend from their profile, or start a group to plan a route together",
  onNewGroup,
}: ChatsEmptyProps) {
  return (
    <View className="flex-1 items-center justify-center px-12">
      <View className="items-center gap-2">
        <Text className="text-center text-xl leading-7 text-chat-list-foreground">
          {title}
        </Text>
        <Text className="text-center text-sm leading-5 text-secondary">
          {description}
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
