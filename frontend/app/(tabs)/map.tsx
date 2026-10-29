import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { PlaceMap } from "@/components/place-map";

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
