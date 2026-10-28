import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { GroupPicker } from "@/components/chats/group-picker";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useAddChatMembers } from "@/hooks/useChatMutations";
import { useChats } from "@/hooks/useChats";
import { useFriends } from "@/hooks/useFriends";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function AddToGroupScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data: friends, isPending, error, refetch } = useFriends();
  const friend = friends?.find((f) => f.user.id === Number(userId));
  const { data: chats } = useChats();
  const hasGroups = Boolean(chats?.some((chat) => chat.type === "GROUP"));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const addMembers = useAddChatMembers({
    onAdded: (chat) => {
      if (friend && chat.type === "GROUP") {
        toast.success(`${friend.user.firstName} was added to ${chat.name}`);
      }
    },
  });

  const handleAdd = () => {
    if (!friend || selectedId === null || addMembers.isPending) return;
    addMembers.mutate(
      { chatId: selectedId, userIds: [friend.user.id] },
      {
        onError: (error) => {
          if (isErrorCode(error, AuthErrorCode.CHAT_NOT_FOUND)) {
            setSelectedId(null);
          }
        },
      },
    );
  };

  const title = friend
    ? `Add ${friend.user.firstName} to a group`
    : "Add to a group";

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title={title} />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !friends ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load your friends")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : !friend ? (
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="You can only add friends to a group"
            description="This person isn't in your friends list anymore."
          />
        </View>
      ) : (
        <>
          <GroupPicker
            friendId={friend.user.id}
            friendName={friend.user.firstName}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNewGroup={() =>
              router.push({
                pathname: "/new-group",
                params: { memberIds: JSON.stringify([friend.user.id]) },
              })
            }
          />
          {hasGroups && (
            <View
              className="px-6 pt-4"
              style={{ paddingBottom: insets.bottom + 24 }}
            >
              <Button
                size="xl"
                disabled={selectedId === null || addMembers.isPending}
                onPress={handleAdd}
              >
                <Text className="text-2xl">
                  {addMembers.isPending ? "Adding…" : "Add"}
                </Text>
              </Button>
            </View>
          )}
        </>
      )}
    </View>
  );
}
