import { useRef, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { FriendsRoutesLayer } from "@/components/map/friends-routes-layer";
import { LayersButton } from "@/components/map/layers-button";
import { MapRouteCard } from "@/components/map/map-route-card";
import { PlaceMap, type PlaceMapHandle } from "@/components/place-map";
import { useFriendsRoutes } from "@/hooks/useFriendsRoutes";
import { useOpenProfile } from "@/hooks/useOpenProfile";
import { useProfile } from "@/hooks/useProfile";

const CARD_MARGIN = 8;

interface Selection {
  routeId: number;
  at: number;
}

export default function MapScreen() {
  const friendsRoutes = useFriendsRoutes();
  const [selection, setSelection] = useState<Selection | null>(null);
  const placeMapRef = useRef<PlaceMapHandle>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const { data: me } = useProfile();
  const openProfile = useOpenProfile();
  const selectedRoute = selection
    ? friendsRoutes.routes?.find((route) => route.id === selection.routeId)
    : undefined;

  return (
    <View className="flex-1">
      <PlaceMap
        ref={placeMapRef}
        overlayHeight={selectedRoute ? cardHeight + CARD_MARGIN : 0}
        onMapPress={() => {
          if (!selectedRoute) return false;
          setSelection(null);
          return true;
        }}
        onPlaceOpen={() => setSelection(null)}
        topControl={
          <LayersButton
            on={friendsRoutes.on}
            loading={friendsRoutes.loading}
            onPress={() => {
              setSelection(null);
              friendsRoutes.toggle();
            }}
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
          <FriendsRoutesLayer
            routes={friendsRoutes.routes}
            selectedRouteId={selectedRoute?.id ?? null}
            onPressRoute={(routeId) => {
              placeMapRef.current?.closePlace();
              setSelection((current) =>
                current?.routeId === routeId
                  ? null
                  : { routeId, at: Date.now() },
              );
            }}
          />
        )}
      </PlaceMap>

      {selection && selectedRoute && (
        <View
          className="absolute bottom-2 left-2 right-2"
          onLayout={(event) => setCardHeight(event.nativeEvent.layout.height)}
        >
          <MapRouteCard
            route={selectedRoute}
            myId={me?.id}
            now={selection.at}
            onAuthorPress={() => openProfile(selectedRoute.participants[0])}
            onPress={() =>
              router.push({
                pathname: "/route/[routeId]",
                params: { routeId: String(selectedRoute.id) },
              })
            }
          />
        </View>
      )}
    </View>
  );
}
