import { formatOsmCategory, type PlaceDetails } from "@/lib/api/geocoding";
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

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === null || value === undefined || typeof value === "string";
}

function isCoordinate(value: unknown, max: number): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value) <= max
  );
}

export function parsePlaceParam(param: string | string[] | undefined) {
  if (typeof param !== "string") return null;
  let value: unknown;
  try {
    value = JSON.parse(param);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const place = value as Record<string, unknown>;
  if (
    typeof place.name !== "string" ||
    !place.name.trim() ||
    !isCoordinate(place.latitude, 90) ||
    !isCoordinate(place.longitude, 180) ||
    !isOptionalString(place.osmId) ||
    !isOptionalString(place.address) ||
    !isOptionalString(place.osmKey) ||
    !isOptionalString(place.osmValue)
  ) {
    return null;
  }
  return {
    osmId: place.osmId ?? null,
    name: place.name,
    address: place.address ?? null,
    osmKey: place.osmKey ?? null,
    osmValue: place.osmValue ?? null,
    latitude: place.latitude,
    longitude: place.longitude,
  } satisfies ChatPlace;
}

export function toPlaceDetails(place: ChatPlace): PlaceDetails {
  const osmKey = place.osmKey ?? undefined;
  const osmValue = place.osmValue ?? undefined;
  return {
    id:
      place.osmId ??
      `pin_${place.latitude.toFixed(6)}_${place.longitude.toFixed(6)}`,
    name: place.name,
    displayName: place.address ?? "",
    category: formatOsmCategory(osmKey, osmValue),
    osmKey,
    osmValue,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}
