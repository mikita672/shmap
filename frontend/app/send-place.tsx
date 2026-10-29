import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PlaceSummary } from "@/components/chats/place-summary";
import { SendTargetPicker } from "@/components/chats/send-target-picker";
import { NoteCard } from "@/components/ui/note-card";
import { TitleHeader } from "@/components/ui/title-header";
import { parsePlaceParam } from "@/lib/chat-place";
import { sendTargetKey, type SendTarget } from "@/lib/send-target";

export default function SendPlaceScreen() {
  const params = useLocalSearchParams<{ place: string }>();
  const place = parsePlaceParam(params.place);
  const [selected, setSelected] = useState<Map<string, SendTarget>>(
    () => new Map(),
  );

  const handleToggle = (target: SendTarget) => {
    setSelected((current) => {
      const next = new Map(current);
      const key = sendTargetKey(target);
      if (next.has(key)) next.delete(key);
      else next.set(key, target);
      return next;
    });
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Send place" />

      {!place ? (
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="This place couldn't be opened"
            description="Go back and pick the place again."
          />
        </View>
      ) : (
        <>
          <View className="px-6 pt-2">
            <PlaceSummary place={place} />
          </View>
          <SendTargetPicker
            selectedKeys={new Set(selected.keys())}
            onToggle={handleToggle}
            onNewGroup={() => router.push("/new-group")}
          />
        </>
      )}
    </View>
  );
}
