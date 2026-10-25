import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerRow } from "@/components/chats/picker-row";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { ConfirmCard } from "@/components/ui/confirm-card";
import { GroupAvatar } from "@/components/ui/group-avatar";
import { Popup } from "@/components/ui/popup";
import { Text } from "@/components/ui/text";
import { useChat } from "@/hooks/useChat";
import { useLeaveChat } from "@/hooks/useChatMutations";
import { useProfile } from "@/hooks/useProfile";
import { MaterialIcons } from "@/lib/icons";
import { getErrorMessage } from "@/lib/utils/error";

export default function GroupInfoScreen() {
  const insets = useSafeAreaInsets();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { data: chat, isPending, error, refetch } = useChat(Number(chatId));
  const { data: me } = useProfile();
  const [leaveConfirmVisible, setLeaveConfirmVisible] = useState(false);
  const leaveChat = useLeaveChat();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!chat) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-center text-chat-list-foreground">
          {getErrorMessage(error, "Couldn't load chat info")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const otherMembers = chat.members ?? [];
  const totalMembers = 1 + otherMembers.length;

  const members = [
    {
      id: me?.id ?? 0,
      name: me ? `${me.firstName} ${me.lastName}`.trim() || me.username : "You",
      subtitle: "you",
      avatarUrl: me?.avatarUrl,
    },
    ...otherMembers.map((member) => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`.trim() || member.username,
      subtitle: `@${member.username}`,
      avatarUrl: member.avatarUrl,
    })),
  ];

  const handleLeaveConfirm = () => {
    leaveChat.mutate(chat.id, {
      onSuccess: () => {
        setLeaveConfirmVisible(false);
      },
    });
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom }}
    >
      <View
        className="h-[52px] flex-row items-center pl-2 pr-6"
        style={{ marginTop: Math.max(insets.top + 8, 48) }}
      >
        <BackButton className="relative" iconSize={40} />
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={RowGap}
        contentContainerClassName="px-6 pb-6"
        ListHeaderComponent={
          <>
            <View className="items-center gap-2 pb-6 pt-2">
              <GroupAvatar size={112} />
              <Text
                numberOfLines={2}
                className="text-center text-2xl font-medium leading-8 text-heading"
              >
                {chat.type === "GROUP" ? chat.name : "Chat info"}
              </Text>
              <Text className="text-center text-sm leading-5 text-secondary">
                {totalMembers} {totalMembers === 1 ? "member" : "members"}
              </Text>
            </View>

            <Text
              role="heading"
              className="pb-3 text-sm font-medium leading-5 tracking-[0.5px] text-secondary"
            >
              Members · {totalMembers}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add friends"
              className="mb-2 h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-5 active:opacity-80"
              onPress={() =>
                router.push({
                  pathname: "/chat/[chatId]/add-members",
                  params: { chatId: String(chatId) },
                })
              }
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-avatar-surface">
                <MaterialIcons
                  name="person-add"
                  size={24}
                  className="text-avatar-surface-foreground"
                />
              </View>
              <Text className="text-base leading-6 text-action-foreground">
                Add friends
              </Text>
            </Pressable>
          </>
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

      {chat.type === "GROUP" && (
        <View
          className="px-6 pt-4"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Button
            variant="destructive"
            size="xl"
            onPress={() => setLeaveConfirmVisible(true)}
          >
            <MaterialIcons name="logout" size={24} className="text-white" />
            <Text className="font-medium">Leave group</Text>
          </Button>
        </View>
      )}

      <Popup
        visible={leaveConfirmVisible}
        onClose={() => {
          if (!leaveChat.isPending) setLeaveConfirmVisible(false);
        }}
      >
        <ConfirmCard
          icon="logout"
          title={`Leave ${chat.name}?`}
          message="You'll stop getting its messages. A friend in the group can add you back."
          confirmLabel="Leave"
          pendingLabel="Leaving…"
          isPending={leaveChat.isPending}
          onConfirm={handleLeaveConfirm}
          onCancel={() => {
            if (!leaveChat.isPending) setLeaveConfirmVisible(false);
          }}
        />
      </Popup>
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
