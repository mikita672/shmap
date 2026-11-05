import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedRef,
  type SharedValue,
} from "react-native-reanimated";
import { AddPlaceButton } from "@/components/routes/add-place-button";
import { PathSummary } from "@/components/routes/path-summary";
import { StopDetails } from "@/components/routes/stop-details";
import { StopList } from "@/components/routes/stop-list";
import { TravelModeSwitch } from "@/components/routes/travel-mode-switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { MaterialIcons } from "@/lib/icons";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";
import type { RouteResponse, TravelMode } from "@/lib/types/api";

const COLLAPSED_HEIGHT = 108;
const MAX_SHARE = 0.6;

export interface RouteSheetProps {
  route: RouteResponse;
  animatedPosition: SharedValue<number>;
  onAddPlace?: () => void;
  onTravelModeChange?: (travelMode: TravelMode) => void;
  onRetryPath?: () => void;
  selectedStopId?: number | null;
  onSelectStop?: (stopId: number | null) => void;
  onRemoveStop?: (stopId: number) => void;
  onReorderStops?: (stopIds: number[]) => void;
}

export function RouteSheet({
  route,
  animatedPosition,
  onAddPlace,
  onTravelModeChange,
  onRetryPath,
  selectedStopId,
  onSelectStop,
  onRemoveStop,
  onReorderStops,
}: RouteSheetProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { data: profile } = useProfile();
  const isFull = route.stops.length >= MAX_ROUTE_STOPS;
  const selectedIndex = route.stops.findIndex(
    (stop) => stop.id === selectedStopId,
  );
  const selectedStop = route.stops[selectedIndex];

  return (
    <BottomSheet
      index={1}
      snapPoints={[COLLAPSED_HEIGHT]}
      enableDynamicSizing
      maxDynamicContentSize={height * MAX_SHARE}
      animatedPosition={animatedPosition}
      handleComponent={SheetHandle}
      backgroundComponent={SheetBackground}
    >
      <BottomSheetScrollView
        ref={scrollRef}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
        }}
      >
        {selectedStop ? (
          <StopDetails
            stop={selectedStop}
            number={selectedIndex + 1}
            onClose={() => onSelectStop?.(null)}
            removeAction={
              onRemoveStop ? (
                <Button
                  variant="destructive"
                  className="h-11 flex-1 gap-2 rounded-xl"
                  onPress={() => onRemoveStop(selectedStop.id)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    className="text-white"
                  />
                  <Text className="text-sm font-medium">Remove</Text>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <PathSummary
                  path={route.path}
                  stopCount={route.stops.length}
                  travelMode={route.travelMode}
                  onRetry={onRetryPath}
                />
              </View>
              <TravelModeSwitch
                value={route.travelMode}
                onValueChange={onTravelModeChange}
              />
            </View>

            <View className="h-px bg-on-surface-muted/25" />

            {route.stops.length > 0 && (
              <StopList
                stops={route.stops}
                myId={profile?.id}
                canReorder={route.canEdit && onReorderStops !== undefined}
                scrollableRef={scrollRef}
                onSelectStop={onSelectStop}
                onReorder={onReorderStops}
              />
            )}

            {route.canEdit && (
              <AddPlaceButton
                label="Add place"
                isFull={isFull}
                onPress={onAddPlace}
              />
            )}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

function SheetHandle() {
  return (
    <View className="items-center pb-3 pt-2">
      <View className="h-1 w-10 rounded-sm bg-on-surface-muted/30" />
    </View>
  );
}

function SheetBackground({ style }: BottomSheetBackgroundProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={style}
      className="rounded-t-3xl bg-surface shadow-xl shadow-black/20 elevation-8"
    />
  );
}
