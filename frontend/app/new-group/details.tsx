import { useState } from "react";
import { FlatList, Platform, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { GroupAvatar } from "@/components/ui/group-avatar";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { TitleHeader } from "@/components/ui/title-header";
import { useCreateGroup } from "@/hooks/useChatMutations";
import { useFriends } from "@/hooks/useFriends";
import { useProfile } from "@/hooks/useProfile";
import { KeyboardAvoidingView } from "@/lib/keyboard";

export default function NewGroupDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { memberIds } = useLocalSearchParams<{ memberIds?: string }>();
  const [groupName, setGroupName] = useState("");
  const createGroup = useCreateGroup();

  const { data: me } = useProfile();
  const { data: friends } = useFriends();

  const pickedMemberIds = parseMemberIds(memberIds);
  const friendMap = new Map(friends?.map((f) => [f.user.id, f]) ?? []);
  const pickedFriends = pickedMemberIds
    .map((id) => friendMap.get(id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  const members = [
    {
      id: me?.id ?? 0,
      name: me ? `${me.firstName} ${me.lastName}`.trim() || me.username : "You",
      subtitle: "you",
      avatarUrl: me?.avatarUrl,
    },
    ...pickedFriends.map((friend) => ({
      id: friend.user.id,
      name: `${friend.user.firstName} ${friend.user.lastName}`.trim(),
      subtitle: `@${friend.user.username}`,
      avatarUrl: friend.user.avatarUrl,
    })),
  ];

  const handleCreate = () => {
    const trimmed = groupName.trim();
    if (trimmed.length === 0 || createGroup.isPending) {
      return;
    }
    createGroup.mutate({
      name: trimmed,
      memberIds: pickedMemberIds,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <TitleHeader title="New group" />

      <FlatList
        data={members}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={RowGap}
        contentContainerClassName="px-6 pb-6"
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="items-center pt-2">
              <GroupAvatar size={96} />
            </View>

            <TextField
              label="Group name"
              maxLength={50}
              value={groupName}
              onChangeText={setGroupName}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />

            <Text
              role="heading"
              className="text-sm font-medium leading-5 tracking-[0.5px] text-secondary"
            >
              Members · {members.length}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PickerRow
            name={item.name}
            subtitle={item.subtitle}
            avatarUrl={item.avatarUrl}
            showCheck={false}
          />
        )}
      />

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          disabled={groupName.trim().length === 0 || createGroup.isPending}
          onPress={handleCreate}
        >
          <Text className="text-2xl">
            {createGroup.isPending ? "Creating…" : "Create group"}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

function parseMemberIds(raw?: string): number[] {
  if (!raw) {
    return [];
  }
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(Number).filter((n) => !Number.isNaN(n) && n > 0);
      }
    }
    return raw
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n) && n > 0);
  } catch {
    return [];
  }
}

function RowGap() {
  return <View className="h-2" />;
}
