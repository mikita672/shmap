import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { RoutePickerRow } from "@/components/routes/route-picker-row";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { chatRoutesQueryOptions, useChatRoutes } from "@/hooks/useChatRoutes";
import { useAddStop } from "@/hooks/useRouteMutations";
import { MaterialIcons } from "@/lib/icons";
import { setRouteFocus } from "@/lib/route-focus";
import type {
  ChatPlace,
  RouteResponse,
  RouteSummaryResponse,
} from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

export interface AddToRoutePopupProps {
  chatId: number;
  place: ChatPlace | null;
  visible: boolean;
  onClose: () => void;
}

export function AddToRoutePopup({
  chatId,
  place,
  visible,
  onClose,
}: AddToRoutePopupProps) {
  const { data: routes, isPending, error, refetch } = useChatRoutes(chatId);
  const [addingRouteId, setAddingRouteId] = useState<number | null>(null);
  const isAdding =
    addingRouteId !== null &&
    Boolean(routes?.some((route) => route.id === addingRouteId));

  const handleClose = () => {
    if (!isAdding) onClose();
  };

  const handleAdded = (route: RouteResponse) => {
    onClose();
    const added = route.stops.at(-1)?.place;
    const toastId = toast.success(`Added to ${route.name}`, {
      action: {
        label: "Open",
        onClick: () => {
          toast.dismiss(toastId);
          if (added) {
            setRouteFocus(route.id, [added.longitude, added.latitude]);
          }
          router.push({
            pathname: "/route/[routeId]",
            params: { routeId: String(route.id) },
          });
        },
      },
    });
  };

  return (
    <Popup visible={visible} onClose={handleClose} className="pb-5 pt-6">
      <View className="items-center gap-1 px-6 pb-4">
        <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-action">
          <MaterialIcons
            name="route"
            size={28}
            className="text-action-foreground"
          />
        </View>
        <Text className="text-center text-xl leading-7 tracking-[0.5px] text-card-title">
          Add to route
        </Text>
        {place && (
          <Text
            numberOfLines={1}
            className="text-center text-sm leading-5 tracking-[0.5px] text-card-muted"
          >
            {place.name}
          </Text>
        )}
      </View>

      {isPending ? (
        <ActivityIndicator size="large" className="py-6 text-card-muted" />
      ) : !routes ? (
        <View className="items-center gap-4 px-6 py-2">
          <Text className="text-center text-sm leading-5 text-card-muted">
            {getErrorMessage(error, "Couldn't load routes")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <>
          {routes.length > 0 ? (
            <ScrollView
              className="max-h-[296px]"
              contentContainerClassName="gap-2 px-5"
            >
              {routes.map((route) => (
                <AddToRouteRow
                  key={route.id}
                  chatId={chatId}
                  route={route}
                  place={place}
                  isAdding={isAdding && route.id === addingRouteId}
                  disabled={isAdding}
                  onStart={() => setAddingRouteId(route.id)}
                  onSettled={() => setAddingRouteId(null)}
                  onAdded={handleAdded}
                />
              ))}
            </ScrollView>
          ) : (
            <Text className="px-6 pb-2 text-center text-sm leading-5 text-card-muted">
              This chat has no routes yet.
            </Text>
          )}
          <View className="px-5 pt-2">
            <RoutePickerRow variant="new" disabled={isAdding} />
          </View>
        </>
      )}

      <RoundButton
        icon="close"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={handleClose}
        disabled={isAdding}
        className="absolute right-4 top-4"
      />
    </Popup>
  );
}

interface AddToRouteRowProps {
  chatId: number;
  route: RouteSummaryResponse;
  place: ChatPlace | null;
  isAdding: boolean;
  disabled: boolean;
  onStart: () => void;
  onSettled: () => void;
  onAdded: (route: RouteResponse) => void;
}

function AddToRouteRow({
  chatId,
  route,
  place,
  isAdding,
  disabled,
  onStart,
  onSettled,
  onAdded,
}: AddToRouteRowProps) {
  const queryClient = useQueryClient();
  const addStop = useAddStop(route.id);

  const handlePress = () => {
    if (!place) return;
    onStart();
    addStop.mutate(place, {
      onSuccess: onAdded,
      onError: () => {
        void queryClient.invalidateQueries({
          queryKey: chatRoutesQueryOptions(chatId).queryKey,
          exact: true,
        });
      },
      onSettled,
    });
  };

  return (
    <RoutePickerRow
      variant="route"
      route={route}
      isAdding={isAdding}
      disabled={disabled}
      onPress={place ? handlePress : undefined}
    />
  );
}
