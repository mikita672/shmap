import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
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

  return (
    <View className={cn("gap-3", className)}>
      <View className="flex-row items-center gap-2">
        <Button size="xl" className="flex-1" disabled>
          <Text className="text-2xl">Message</Text>
        </Button>
        <RoundButton
          icon={favorite ? "star" : "star-border"}
          size="lg"
          iconClassName={favorite ? "text-favorite" : undefined}
          accessibilityLabel={
            favorite ? "Remove from favorites" : "Add to favorites"
          }
          disabled={setFavorite.isPending}
          onPress={() => setFavorite.mutate({ friendId, favorite: !favorite })}
        />
      </View>

      <Button variant="secondary" size="xl" disabled>
        <Text>Add to group</Text>
      </Button>
    </View>
  );
}
