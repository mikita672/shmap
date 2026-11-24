import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { FriendsRoutesLayer } from "@/components/map/friends-routes-layer";
import { LayersButton } from "@/components/map/layers-button";
import { PlaceMap } from "@/components/place-map";
import { useFriendsRoutes } from "@/hooks/useFriendsRoutes";

export default function MapScreen() {
  const friendsRoutes = useFriendsRoutes();

  return (
    <PlaceMap
      topControl={
        <LayersButton
          on={friendsRoutes.on}
          loading={friendsRoutes.loading}
          onPress={friendsRoutes.toggle}
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
      {friendsRoutes.routes && (
        <FriendsRoutesLayer routes={friendsRoutes.routes} />
      )}
    </PlaceMap>
  );
}
