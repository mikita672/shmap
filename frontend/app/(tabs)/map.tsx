import { router } from "expo-router";
import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
} from "@/components/place-actions";
import { PlaceMap } from "@/components/place-map";
import type { PlaceDetails } from "@/lib/api/geocoding";
import { toChatPlace } from "@/lib/chat-place";

function openSendPlace(place: PlaceDetails) {
  router.push({
    pathname: "/send-place",
    params: { place: JSON.stringify(toChatPlace(place)) },
  });
}

export default function MapScreen() {
  return (
    <PlaceMap
      renderActions={(place) => (
        <>
          <SendPlaceButton onPress={() => openSendPlace(place)} />
          <CopyPlaceButton place={place} />
          <SharePlaceButton place={place} />
        </>
      )}
    />
  );
}
