import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { LayersButton } from "@/components/map/layers-button";
import { PlaceMap } from "@/components/place-map";
import { useFriendsRoutesLayer } from "@/hooks/useFriendsRoutesLayer";

export default function MapScreen() {
  const [friendsRoutesOn, setFriendsRoutesOn] = useFriendsRoutesLayer();

  return (
    <PlaceMap
      topControl={
        <LayersButton
          on={friendsRoutesOn}
          onPress={() => setFriendsRoutesOn(!friendsRoutesOn)}
        />
      }
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
