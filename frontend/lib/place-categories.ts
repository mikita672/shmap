import type { MaterialIconName } from "@/lib/icons";
import { PlaceCategory } from "@/lib/types/api";

export const PLACE_CATEGORY_INFO: Record<
  PlaceCategory,
  { label: string; icon: MaterialIconName }
> = {
  MUSEUMS: { label: "Museums", icon: "museum" },
  LANDMARKS: { label: "Landmarks", icon: "account-balance" },
  VIEWPOINTS: { label: "Viewpoints", icon: "landscape" },
  PARKS: { label: "Parks", icon: "park" },
  FOOD: { label: "Food", icon: "restaurant" },
  CAFES: { label: "Cafés", icon: "local-cafe" },
  NIGHTLIFE: { label: "Nightlife", icon: "nightlife" },
  CULTURE: { label: "Culture", icon: "theater-comedy" },
  FAMILY: { label: "Family", icon: "attractions" },
  SHOPPING: { label: "Shopping", icon: "shopping-bag" },
  CHURCHES: { label: "Churches", icon: "church" },
};

export const PLACE_CATEGORIES = Object.values(PlaceCategory);
