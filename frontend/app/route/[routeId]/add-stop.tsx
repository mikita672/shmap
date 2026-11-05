import { router, useLocalSearchParams } from "expo-router";
import { AddPlaceButton } from "@/components/routes/add-place-button";
import { RouteLayers } from "@/components/routes/route-layers";
import { PlaceMap } from "@/components/place-map";
import { useRoute } from "@/hooks/useRoute";
import { useAddStop } from "@/hooks/useRouteMutations";
import type { PlaceDetails } from "@/lib/api/geocoding";
import { toChatPlace } from "@/lib/chat-place";
import { setRouteFocus } from "@/lib/route-focus";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";

export default function AddStopScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { data: route } = useRoute(Number(routeId));
  const addStop = useAddStop(Number(routeId));
  const isFull = (route?.stops.length ?? 0) >= MAX_ROUTE_STOPS;

  const handleAdd = (place: PlaceDetails) => {
    addStop.mutate(toChatPlace(place), {
      onSuccess: (updated) => {
        const added = updated.stops.at(-1)?.place;
        if (added) {
          setRouteFocus(updated.id, [added.longitude, added.latitude]);
        }
        router.back();
      },
    });
  };

  return (
    <PlaceMap
      leading="back"
      sheetOpensExpanded
      renderActions={(place) => (
        <AddPlaceButton
          className="flex-1"
          label={
            addStop.isPending
              ? "Adding…"
              : route
                ? `Add to ${route.name}`
                : "Add to route"
          }
          isFull={isFull}
          disabled={!route || addStop.isPending}
          onPress={() => handleAdd(place)}
        />
      )}
    >
      {route && <RouteLayers route={route} />}
    </PlaceMap>
  );
}
