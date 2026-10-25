import { ActivityIndicator, FlatList, View } from "react-native";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useFriends } from "@/hooks/useFriends";
import { getErrorMessage } from "@/lib/utils/error";

export interface FriendPickerProps {
  selectedIds: Set<number>;
  onToggle: (friendId: number) => void;
  members?: Set<number>;
}

export function FriendPicker({
  selectedIds,
  onToggle,
  members,
}: FriendPickerProps) {
  const { data: friends, isPending, error, refetch } = useFriends();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!friends) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center text-chat-list-foreground">
          {getErrorMessage(error, "Couldn't load your friends")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(friend) => String(friend.user.id)}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6"
      ListEmptyComponent={
        <Text className="pt-10 text-center text-sm leading-5 text-secondary">
          No friends yet
        </Text>
      }
      renderItem={({ item: friend }) => {
        const isMember = Boolean(members?.has(friend.user.id));
        const isSelected = selectedIds.has(friend.user.id);
        const selected = isMember ? "member" : isSelected ? "on" : "off";
        const name = `${friend.user.firstName} ${friend.user.lastName}`.trim();
        const subtitle = isMember
          ? "Already in the group"
          : `@${friend.user.username}`;

        return (
          <PickerRow
            name={name}
            subtitle={subtitle}
            avatarUrl={friend.user.avatarUrl}
            selected={selected}
            onPress={isMember ? undefined : () => onToggle(friend.user.id)}
          />
        );
      }}
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
