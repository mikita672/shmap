import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { PlaceMap } from "@/components/place-map";
import { NoteCard } from "@/components/ui/note-card";
import { TitleHeader } from "@/components/ui/title-header";
import { parsePlaceParam, toPlaceDetails } from "@/lib/chat-place";

export default function PlaceScreen() {
  const params = useLocalSearchParams<{ place: string }>();
  const place = parsePlaceParam(params.place);

  if (!place) {
    return (
      <View className="flex-1 bg-background">
        <TitleHeader title="Place" />
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="This place couldn't be opened"
            description="Go back and try again."
          />
        </View>
      </View>
    );
  }

  return (
    <PlaceMap
      initialPlace={toPlaceDetails(place)}
      leading="back"
      renderActions={(sheetPlace) => (
        <>
          <SendPlaceButton onPress={() => openSendPlace(sheetPlace)} />
          <CopyPlaceButton place={sheetPlace} />
          <SharePlaceButton place={sheetPlace} />
        </>
      )}
    />
  );
}
