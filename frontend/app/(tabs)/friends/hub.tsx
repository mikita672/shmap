import { useState } from "react";
import { View } from "react-native";
import { RoundButton } from "@/components/ui/round-button";
import { ScreenHeader } from "@/components/ui/screen-header";
import {
  SegmentedControl,
  type Segment,
} from "@/components/ui/segmented-control";

type HubTab = "friends" | "requests";

const HUB_TABS: readonly Segment<HubTab>[] = [
  { value: "friends", label: "Friends" },
  { value: "requests", label: "Requests" },
];

export default function FriendsHubScreen() {
  const [tab, setTab] = useState<HubTab>("friends");

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Friends" />

      <View className="flex-row items-center gap-2 px-6 pt-3">
        <SegmentedControl
          segments={HUB_TABS}
          value={tab}
          onValueChange={setTab}
          className="flex-1"
        />
        <RoundButton icon="add" size="md" accessibilityLabel="Add friends" />
      </View>
    </View>
  );
}
