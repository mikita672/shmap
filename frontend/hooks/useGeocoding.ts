import { useCallback, useEffect, useState } from "react";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchPlaces,
  featureToPlace,
  type SearchPlace,
} from "@/lib/api/geocoding";

const DEBOUNCE_MS = 350;

const geocodingQueryOptions = (query: string, lat?: number, lon?: number) =>
  queryOptions({
    queryKey: ["geocoding", query, lat, lon],
    queryFn: async () => {
      const features = await searchPlaces({ query, lat, lon });
      return features.map(featureToPlace);
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export function useGeocoding(
  query: string,
  options?: { lat?: number; lon?: number },
  active = true,
) {
  const queryClient = useQueryClient();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const enabled = active && debouncedQuery.trim().length >= 2;

  const { data, isFetching, error } = useQuery({
    ...geocodingQueryOptions(debouncedQuery, options?.lat, options?.lon),
    enabled,
  });

  // Skip the debounce and resolve with the results for the current query,
  // reusing cached or in-flight data, e.g. when the user submits the search
  const searchNow = useCallback(async (): Promise<SearchPlace[]> => {
    setDebouncedQuery(query);
    if (query.trim().length < 2) return [];
    return queryClient.fetchQuery(
      geocodingQueryOptions(query, options?.lat, options?.lon),
    );
  }, [query, options?.lat, options?.lon, queryClient]);

  return {
    results: enabled ? (data ?? []) : ([] as SearchPlace[]),
    isSearching: enabled && isFetching,
    error,
    searchNow,
  };
}
