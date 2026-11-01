import { View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { useOpenDirectChat } from "@/hooks/useChatMutations";
import { useSetFavorite } from "@/hooks/useFriendMutations";
import { cn } from "@/lib/utils";

export interface FriendActionsProps {
  friendId: number;
  favorite: boolean;
  className?: string;
}

export function FriendActions({
  friendId,
  favorite,
  className,
}: FriendActionsProps) {
  const setFavorite = useSetFavorite();
  const openChat = useOpenDirectChat();
  const shownFavorite = setFavorite.isPending
    ? setFavorite.variables.favorite
    : favorite;

  return (
    <View className={cn("gap-3", className)}>
      <View className="flex-row items-center gap-2">
        <Button
          size="xl"
          className="flex-1"
          disabled={openChat.isPending}
          onPress={() => openChat.mutate(friendId)}
        >
          <Text className="text-2xl">Message</Text>
        </Button>
        <RoundButton
          icon={shownFavorite ? "star" : "star-border"}
          size="lg"
          iconClassName={shownFavorite ? "text-favorite" : undefined}
          accessibilityLabel={
            shownFavorite ? "Remove from favorites" : "Add to favorites"
          }
          onPress={() => {
            if (setFavorite.isPending) return;
            setFavorite.mutate({ friendId, favorite: !favorite });
          }}
        />
      </View>

      <Button
        variant="secondary"
        size="xl"
        onPress={() =>
          router.push({
            pathname: "/add-to-group/[userId]",
            params: { userId: String(friendId) },
          })
        }
      >
        <Text>Add to group</Text>
      </Button>
    </View>
  );
}
