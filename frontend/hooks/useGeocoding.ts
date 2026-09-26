import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchPlaces,
  featureToPlace,
  type SearchPlace,
} from "@/lib/api/geocoding";

const DEBOUNCE_MS = 350;

export function useGeocoding(
  query: string,
  options?: { lat?: number; lon?: number },
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const enabled = debouncedQuery.trim().length >= 2;

  const { data, isFetching, error } = useQuery({
    queryKey: ["geocoding", debouncedQuery, options?.lat, options?.lon],
    queryFn: async () => {
      const features = await searchPlaces({
        query: debouncedQuery,
        lat: options?.lat,
        lon: options?.lon,
      });
      return features.map(featureToPlace);
    },
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    results: enabled ? (data ?? []) : ([] as SearchPlace[]),
    isSearching: enabled && isFetching,
    error,
  };
}
