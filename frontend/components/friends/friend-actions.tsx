import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface FriendActionsProps {
  className?: string;
}

export function FriendActions({ className }: FriendActionsProps) {
  return (
    <View className={cn("gap-3", className)}>
      <View className="flex-row items-center gap-2">
        <Button size="xl" className="flex-1" disabled>
          <Text className="text-2xl">Message</Text>
        </Button>
      </View>

      <Button variant="secondary" size="xl" disabled>
        <Text>Add to group</Text>
      </Button>
    </View>
  );
}
