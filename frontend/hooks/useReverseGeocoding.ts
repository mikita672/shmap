import { useQuery } from "@tanstack/react-query";
import {
  reverseGeocode,
  droppedPin,
  type PlaceDetails,
} from "@/lib/api/geocoding";

export interface UseReverseGeocodingResult {
  place: PlaceDetails | null;
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface UseReverseGeocodingOptions {
  lang?: string;
  useFallback?: boolean;
}

export function useReverseGeocoding(
  coords: { lat: number; lon: number } | null,
  options: UseReverseGeocodingOptions = {},
): UseReverseGeocodingResult {
  const { lang = "en", useFallback = true } = options;

  const lat = coords ? parseFloat(coords.lat.toFixed(5)) : null;
  const lon = coords ? parseFloat(coords.lon.toFixed(5)) : null;
  const enabled = lat !== null && lon !== null;

  const { data, isFetching, isError, refetch } = useQuery<PlaceDetails | null>({
    queryKey: ["reverseGeocoding", lat, lon, lang],
    queryFn: async () => {
      const result = await reverseGeocode({ lat: lat!, lon: lon!, lang });

      if (result === null && useFallback) {
        return droppedPin(lat!, lon!);
      }
      return result;
    },
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    place: enabled ? (data ?? null) : null,
    isLoading: enabled && isFetching,
    isEmpty: enabled && !isFetching && !isError && data === null,
    isError: enabled && isError,
    refetch,
  };
}
