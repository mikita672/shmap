import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { FriendsList } from "@/components/friends/friends-list";
import { RequestsList } from "@/components/friends/requests-list";
import { RoundButton } from "@/components/ui/round-button";
import { ScreenHeader } from "@/components/ui/screen-header";
import {
  SegmentedControl,
  type Segment,
} from "@/components/ui/segmented-control";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

type HubTab = "friends" | "requests";

const MAX_GROUP_PICKS = 50;

export default function FriendsHubScreen() {
  const [tab, setTab] = useState<HubTab>("friends");
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);

  const handleToggle = (friendId: number) => {
    const current = selectedIds ?? new Set<number>();
    const next = new Set(current);
    if (next.has(friendId)) {
      next.delete(friendId);
    } else if (next.size >= MAX_GROUP_PICKS) {
      toast(`A group can start with up to ${MAX_GROUP_PICKS} friends`);
      return;
    } else {
      next.add(friendId);
    }
    setSelectedIds(next);
  };
  const { data: requestCount = 0, refetch: refetchRequestCount } =
    useIncomingRequestCount();
  useRefreshOnFocus(refetchRequestCount);

  const segments: Segment<HubTab>[] = [
    { value: "friends", label: "Friends" },
    { value: "requests", label: "Requests", badge: requestCount },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Friends" />

      <View className="flex-row items-center gap-2 px-6 pt-3">
        <SegmentedControl
          segments={segments}
          value={tab}
          onValueChange={setTab}
          className="flex-1"
        />
        <RoundButton
          icon="add"
          size="md"
          accessibilityLabel="Add friends"
          onPress={() => router.push("/friends/add")}
        />
      </View>

      {tab === "friends" && (
        <FriendsList
          selectedIds={selectedIds}
          onStartSelect={() => setSelectedIds(new Set())}
          onToggle={handleToggle}
        />
      )}
      {tab === "requests" && <RequestsList />}
    </View>
  );
}
