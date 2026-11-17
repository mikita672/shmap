import { View } from "react-native";
import { MaterialIcons } from "@/lib/icons";
import { PLACE_CATEGORY_INFO } from "@/lib/place-categories";
import type { PlaceCategory } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface SuggestionPinProps {
  category: PlaceCategory;
  selected?: boolean;
}

export function SuggestionPin({
  category,
  selected = false,
}: SuggestionPinProps) {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-full shadow-sm shadow-black/35 elevation-2",
        selected
          ? "h-11 w-11 border-[3px] border-map-pin-foreground bg-action-chip"
          : "h-8 w-8 border-2 border-action-chip bg-map-pin-foreground",
      )}
    >
      <MaterialIcons
        name={PLACE_CATEGORY_INFO[category].icon}
        size={selected ? 24 : 18}
        className="text-action-chip-foreground"
      />
    </View>
  );
}
