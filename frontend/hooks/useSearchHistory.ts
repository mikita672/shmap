import { useCallback, useEffect, useState } from "react";
import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
} from "@/lib/storage/search-history";
import type { SearchPlace } from "@/lib/api/geocoding";

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchPlace[]>([]);

  useEffect(() => {
    getSearchHistory().then(setHistory);
  }, []);

  const addPlace = useCallback(async (place: SearchPlace) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== place.id);
      return [place, ...filtered].slice(0, 20);
    });
    await addToSearchHistory(place);
  }, []);

  const removePlace = useCallback(async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    await removeFromSearchHistory(id);
  }, []);

  const clearAll = useCallback(async () => {
    setHistory([]);
    await clearSearchHistory();
  }, []);

  return { history, addPlace, removePlace, clearAll };
}
