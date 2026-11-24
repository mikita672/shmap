import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { FriendsRoutesLayer } from "@/components/map/friends-routes-layer";
import { LayersButton } from "@/components/map/layers-button";
import { PlaceMap } from "@/components/place-map";
import { useFeedMap } from "@/hooks/useFeedMap";
import { useFriendsRoutesLayer } from "@/hooks/useFriendsRoutesLayer";

export default function MapScreen() {
  const [friendsRoutesOn, setFriendsRoutesOn] = useFriendsRoutesLayer();
  const { data: friendsRoutes } = useFeedMap(friendsRoutesOn);

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
    >
      {friendsRoutesOn && friendsRoutes && (
        <FriendsRoutesLayer routes={friendsRoutes.routes} />
      )}
    </PlaceMap>
  );
}
