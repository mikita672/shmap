import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SearchPlace } from "@/lib/api/geocoding";

const HISTORY_KEY = "@search-history/places";
const MAX_HISTORY_ITEMS = 5;

export async function getSearchHistory(): Promise<SearchPlace[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SearchPlace[];
  } catch {
    return [];
  }
}

export async function addToSearchHistory(place: SearchPlace): Promise<void> {
  const history = await getSearchHistory();

  const filtered = history.filter((item) => item.id !== place.id);

  const updated = [place, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function removeFromSearchHistory(id: string): Promise<void> {
  const history = await getSearchHistory();
  const updated = history.filter((item) => item.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function clearSearchHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
