import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FriendPicker } from "@/components/chats/friend-picker";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { parseMemberIds } from "@/lib/member-ids";

export default function NewGroupScreen() {
  const insets = useSafeAreaInsets();
  const { memberIds } = useLocalSearchParams<{ memberIds?: string }>();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(parseMemberIds(memberIds)),
  );

  const handleToggle = (friendId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(friendId)) {
        next.delete(friendId);
      } else {
        next.add(friendId);
      }
      return next;
    });
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="New group" />

      <FriendPicker selectedIds={selectedIds} onToggle={handleToggle} />

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          disabled={selectedIds.size === 0}
          onPress={() =>
            router.push({
              pathname: "/new-group/details",
              params: { memberIds: JSON.stringify(Array.from(selectedIds)) },
            })
          }
        >
          <Text className="text-2xl">Next</Text>
        </Button>
      </View>
    </View>
  );
}
