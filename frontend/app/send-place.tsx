import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PlaceSummary } from "@/components/chats/place-summary";
import { NoteCard } from "@/components/ui/note-card";
import { TitleHeader } from "@/components/ui/title-header";
import { parsePlaceParam } from "@/lib/chat-place";

export default function SendPlaceScreen() {
  const params = useLocalSearchParams<{ place: string }>();
  const place = parsePlaceParam(params.place);

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
        <View className="px-6 pt-2">
          <PlaceSummary place={place} />
        </View>
      )}
    </View>
  );
}
