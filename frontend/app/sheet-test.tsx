import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Sortable, { type SortableGridRenderItem } from "react-native-sortables";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";

interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Stop ${i + 1}`,
}));

export default function SheetTestScreen() {
  const { height } = useWindowDimensions();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [rows, setRows] = useState(ROWS);

  const renderItem = useCallback<SortableGridRenderItem<Row>>(
    ({ item, index }) => (
      <View className="flex-row items-center gap-3 rounded-2xl bg-action px-4 py-3">
        <Text className="w-6 text-card-title">{index + 1}</Text>
        <Text className="flex-1 text-card-foreground">{item.name}</Text>
        <Sortable.Handle>
          <MaterialIcons
            name="drag-handle"
            size={24}
            className="text-card-muted"
          />
        </Sortable.Handle>
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <Text className="mt-24 px-6 text-center">
        Order: {rows.map((row) => row.id).join(" ")}
      </Text>
      <BottomSheet
        index={1}
        snapPoints={[140]}
        enableDynamicSizing
        maxDynamicContentSize={height * 0.6}
        backgroundStyle={{ backgroundColor: "#FEFAE0" }}
      >
        <BottomSheetScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16 }}
        >
          <Sortable.Grid
            columns={1}
            data={rows}
            renderItem={renderItem}
            rowGap={8}
            customHandle
            scrollableRef={scrollRef}
            onDragEnd={({ data }) => setRows(data)}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
