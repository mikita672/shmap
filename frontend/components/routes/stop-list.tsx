import { useCallback } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  type AnimatedRef,
} from "react-native-reanimated";
import Sortable, {
  useItemContext,
  type SortableGridRenderItem,
} from "react-native-sortables";
import { StopDragHandle, StopRow } from "@/components/routes/stop-row";
import { formatStopSubtitle } from "@/lib/route-format";
import type { RouteStopResponse } from "@/lib/types/api";

export interface StopListProps {
  stops: RouteStopResponse[];
  myId?: number;
  canReorder: boolean;
  scrollableRef: AnimatedRef<Animated.ScrollView>;
  onSelectStop?: (stopId: number) => void;
  onReorder?: (stopIds: number[]) => void;
}

export function StopList({
  stops,
  myId,
  canReorder,
  scrollableRef,
  onSelectStop,
  onReorder,
}: StopListProps) {
  const renderItem = useCallback<SortableGridRenderItem<RouteStopResponse>>(
    ({ item, index }) => (
      <SortableStop>
        <StopRow
          number={index + 1}
          name={item.place.name}
          subtitle={formatStopSubtitle(item, myId)}
          lineAbove={index > 0}
          lineBelow={index < stops.length - 1}
          trailing={
            canReorder ? (
              <Sortable.Handle>
                <StopDragHandle />
              </Sortable.Handle>
            ) : undefined
          }
          onPress={onSelectStop ? () => onSelectStop(item.id) : undefined}
        />
      </SortableStop>
    ),
    [myId, stops.length, canReorder, onSelectStop],
  );

  return (
    <Sortable.Grid
      columns={1}
      data={stops}
      keyExtractor={(stop) => String(stop.id)}
      renderItem={renderItem}
      customHandle
      sortEnabled={canReorder}
      hapticsEnabled
      activeItemScale={1.02}
      activeItemShadowOpacity={0}
      scrollableRef={scrollableRef}
      onDragEnd={({ data, fromIndex, toIndex }) => {
        if (fromIndex !== toIndex) {
          onReorder?.(data.map((stop) => stop.id));
        }
      }}
    />
  );
}

function SortableStop({ children }: { children: React.ReactNode }) {
  const { activationAnimationProgress } = useItemContext();
  const cardStyle = useAnimatedStyle(() => ({
    opacity: activationAnimationProgress.value,
  }));

  return (
    <View>
      <Animated.View
        pointerEvents="none"
        style={cardStyle}
        className="absolute -inset-x-2 inset-y-0 rounded-2xl bg-surface shadow-lg shadow-black/25 elevation-6"
      />
      {children}
    </View>
  );
}
