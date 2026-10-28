import { useCallback, useState } from "react";
import { BackHandler, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useMutationState } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { FriendsList } from "@/components/friends/friends-list";
import { RequestsList } from "@/components/friends/requests-list";
import { Button } from "@/components/ui/button";
import { RoundButton } from "@/components/ui/round-button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SelectionHeader } from "@/components/ui/selection-header";
import {
  SegmentedControl,
  type Segment,
} from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { createGroupMutationKey } from "@/hooks/useChatMutations";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

type HubTab = "friends" | "requests";

const MAX_GROUP_PICKS = 50;

export default function FriendsHubScreen() {
  const [tab, setTab] = useState<HubTab>("friends");
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);
  const [selectStartedAt, setSelectStartedAt] = useState<number | null>(null);
  const createdAt = useMutationState({
    filters: { mutationKey: createGroupMutationKey, status: "success" },
    select: (mutation) => mutation.state.submittedAt,
  });
  const lastCreatedAt = createdAt.at(-1);

  if (
    selectStartedAt !== null &&
    lastCreatedAt !== undefined &&
    lastCreatedAt > selectStartedAt
  ) {
    setSelectedIds(null);
    setSelectStartedAt(null);
  }

  const startSelecting = () => {
    setSelectedIds(new Set());
    setSelectStartedAt(Date.now());
  };

  const stopSelecting = () => {
    setSelectedIds(null);
    setSelectStartedAt(null);
  };

  const isSelecting = selectedIds !== null;

  useFocusEffect(
    useCallback(() => {
      if (!isSelecting) return;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          stopSelecting();
          return true;
        },
      );
      return () => subscription.remove();
    }, [isSelecting]),
  );

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
      {selectedIds ? (
        <SelectionHeader count={selectedIds.size} onClose={stopSelecting} />
      ) : (
        <ScreenHeader title="Friends" />
      )}

      <View className="flex-row items-center gap-2 px-6 pt-3">
        <SegmentedControl
          segments={segments}
          value={tab}
          onValueChange={(next) => {
            setTab(next);
            if (next !== "friends") stopSelecting();
          }}
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
          onStartSelect={startSelecting}
          onToggle={handleToggle}
        />
      )}
      {tab === "requests" && <RequestsList />}

      {selectedIds && (
        <View className="px-6 py-3">
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
            <Text className="text-2xl">
              {selectedIds.size > 0
                ? `Create group · ${selectedIds.size}`
                : "Create group"}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
