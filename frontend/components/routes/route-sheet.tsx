import { Pressable, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, { type SharedValue } from "react-native-reanimated";
import { PathSummary } from "@/components/routes/path-summary";
import { StopDragHandle, StopRow } from "@/components/routes/stop-row";
import { TravelModeSwitch } from "@/components/routes/travel-mode-switch";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { MaterialIcons } from "@/lib/icons";
import { MAX_ROUTE_STOPS, formatStopSubtitle } from "@/lib/route-format";
import type { RouteResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const COLLAPSED_HEIGHT = 108;
const MAX_SHARE = 0.6;

export interface RouteSheetProps {
  route: RouteResponse;
  animatedPosition: SharedValue<number>;
  onAddPlace?: () => void;
}

export function RouteSheet({
  route,
  animatedPosition,
  onAddPlace,
}: RouteSheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { data: profile } = useProfile();
  const isFull = route.stops.length >= MAX_ROUTE_STOPS;

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
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <PathSummary
              path={route.path}
              stopCount={route.stops.length}
              travelMode={route.travelMode}
            />
          </View>
          <TravelModeSwitch value={route.travelMode} />
        </View>

        <View className="h-px bg-on-surface-muted/25" />

        {route.stops.length > 0 && (
          <View>
            {route.stops.map((stop, index) => (
              <StopRow
                key={stop.id}
                number={index + 1}
                name={stop.place.name}
                subtitle={formatStopSubtitle(stop, profile?.id)}
                lineAbove={index > 0}
                lineBelow={index < route.stops.length - 1}
                trailing={route.canEdit ? <StopDragHandle /> : undefined}
              />
            ))}
          </View>
        )}

        {route.canEdit && (
          <Pressable
            onPress={onAddPlace}
            disabled={!onAddPlace || isFull}
            accessibilityRole="button"
            className={cn(
              "h-11 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:opacity-80",
              (!onAddPlace || isFull) && "opacity-50",
            )}
          >
            {!isFull && (
              <MaterialIcons
                name="add"
                size={20}
                className="text-primary-foreground"
              />
            )}
            <Text className="text-sm font-medium leading-4 text-primary-foreground">
              {isFull
                ? `Route is full · ${MAX_ROUTE_STOPS} stops`
                : "Add place"}
            </Text>
          </Pressable>
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
