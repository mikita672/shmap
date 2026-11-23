import type { MaterialIconName } from "@/lib/icons";
import { PlaceCategory, type RouteInterestResponse } from "@/lib/types/api";

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

export function countInterests(interests: RouteInterestResponse[]) {
  const counts = new Map<PlaceCategory, number>();
  for (const { categories } of interests) {
    for (const category of categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return PLACE_CATEGORIES.flatMap((category) => {
    const count = counts.get(category);
    return count ? [{ category, count }] : [];
  }).sort((a, b) => b.count - a.count);
}

export function formatPickedCount(pickedCount: number, memberCount?: number) {
  if (pickedCount === 0) return "Nobody picked yet";
  if (memberCount === undefined) return `${pickedCount} picked`;
  const people = memberCount === 1 ? "person" : "people";
  return `${pickedCount} of ${memberCount} ${people} picked`;
}
