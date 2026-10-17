import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { NoteCard } from "@/components/ui/note-card";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";

export default function FriendsFeedScreen() {
  const insets = useSafeAreaInsets();
  const { data: requestCount = 0 } = useIncomingRequestCount();
  const headerTop = Math.max(insets.top + 8, 48);

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-6"
        style={{ marginTop: headerTop }}
      >
        <Text
          role="heading"
          className="text-heading text-[32px] leading-10 tracking-[0.5px]"
        >
          Friends
        </Text>
        <RoundButton
          icon="groups"
          size="lg"
          badge={requestCount}
          accessibilityLabel={friendsButtonLabel(requestCount)}
          onPress={() => router.push("/friends/hub")}
        />
      </View>

      <View className="flex-1 justify-center px-6">
        <NoteCard
          title="No routes yet"
          description="Routes your friends take will show up here."
        />
      </View>
    </View>
  );
}

function friendsButtonLabel(requestCount: number) {
  if (requestCount <= 0) return "Friends";
  const requests = requestCount === 1 ? "request" : "requests";
  return `Friends, ${requestCount} pending ${requests}`;
}
