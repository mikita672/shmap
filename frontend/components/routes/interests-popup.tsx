import { useState } from "react";
import { ScrollView, View } from "react-native";
import { CategoryChip } from "@/components/routes/category-chip";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { Text } from "@/components/ui/text";
import { useSetInterests } from "@/hooks/useRouteMutations";
import { MaterialIcons } from "@/lib/icons";
import { PLACE_CATEGORIES } from "@/lib/place-categories";
import type { PlaceCategory } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

export interface InterestsPopupProps {
  routeId: number;
  initial: PlaceCategory[];
  visible: boolean;
  onClose: () => void;
}

export function InterestsPopup({
  routeId,
  initial,
  visible,
  onClose,
}: InterestsPopupProps) {
  const [selected, setSelected] = useState(() => new Set(initial));
  const save = useSetInterests(routeId);

  const toggle = (category: PlaceCategory) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const handleClose = () => {
    if (!save.isPending) onClose();
  };

  const handleSave = () => {
    save.mutate(
      PLACE_CATEGORIES.filter((category) => selected.has(category)),
      { onSuccess: onClose },
    );
  };

  return (
    <Popup visible={visible} onClose={handleClose} className="max-h-[90%]">
      <View className="shrink pb-6">
        <ScrollView
          className="shrink grow-0"
          contentContainerClassName="items-center px-6 pt-8"
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
            <MaterialIcons
              name="auto-awesome"
              size={28}
              className="text-action-foreground"
            />
          </View>

          <View className="w-full items-center gap-2 pb-5 pt-4">
            <Text className="text-center text-[22px] text-card-title">
              What would you like to visit?
            </Text>
            <Text className="text-center text-sm leading-5 text-card-muted">
              Pick your interests for this route. AI suggests places from
              everyone&apos;s picks.
            </Text>
          </View>

          <View className="w-full flex-row flex-wrap gap-2 pb-6">
            {PLACE_CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                category={category}
                variant={selected.has(category) ? "on" : "off"}
                onPress={save.isPending ? undefined : () => toggle(category)}
              />
            ))}
          </View>

          {save.isError && (
            <Text className="w-full pb-4 text-center text-sm leading-5 text-destructive dark:text-card-title">
              {getErrorMessage(save.error, "Couldn't save your interests")}
            </Text>
          )}
        </ScrollView>

        <View className="w-full gap-2 px-6">
          <Button
            size="xl"
            className="w-full"
            disabled={save.isPending}
            onPress={handleSave}
          >
            <Text className="text-2xl">
              {save.isPending ? "Saving…" : "Save"}
            </Text>
          </Button>
          <Button
            variant="secondary"
            size="xl"
            className="w-full"
            disabled={save.isPending}
            onPress={handleClose}
          >
            <Text className="text-xl">Cancel</Text>
          </Button>
        </View>
      </View>
    </Popup>
  );
}
