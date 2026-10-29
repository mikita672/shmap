import type { PlaceDetails } from "@/lib/api/geocoding";
import type { ChatPlace } from "@/lib/types/api";

const MAX_NAME = 200;
const MAX_ADDRESS = 300;
const MAX_OSM_ID = 32;
const MAX_OSM_TAG = 50;

function limit(value: string | undefined, max: number) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function formatAddress(place: PlaceDetails) {
  const street = [place.street, place.housenumber].filter(Boolean).join(" ");
  const address = [street, place.city].filter(Boolean).join(", ");
  return address || place.displayName;
}

export function toChatPlace(place: PlaceDetails): ChatPlace {
  return {
    osmId: place.id.startsWith("pin_") ? null : limit(place.id, MAX_OSM_ID),
    name: limit(place.name, MAX_NAME) ?? "Dropped Pin",
    address: limit(formatAddress(place), MAX_ADDRESS),
    osmKey: limit(place.osmKey, MAX_OSM_TAG),
    osmValue: limit(place.osmValue, MAX_OSM_TAG),
    latitude: place.latitude,
    longitude: place.longitude,
  };
}
