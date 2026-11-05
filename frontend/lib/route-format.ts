import { formatOsmCategory } from "@/lib/api/geocoding";
import { formatChatListTime } from "@/lib/chat-time";
import type { RouteStopResponse, TravelMode } from "@/lib/types/api";

export const MAX_ROUTE_STOPS = 25;

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  WALKING: "Walking",
  DRIVING: "Driving",
};

export function formatStopCount(count: number) {
  if (count === 0) return "No stops";
  return count === 1 ? "1 stop" : `${count} stops`;
}

export function formatRouteCount(count: number) {
  return count === 1 ? "1 route" : `${count} routes`;
}

export function formatDistance(meters: number) {
  const roundedMeters = Math.round(meters / 10) * 10;
  if (roundedMeters < 1000) return `${roundedMeters} m`;

  const kilometers = Math.round(meters / 100) / 10;
  if (kilometers < 100) return `${kilometers.toFixed(1)} km`;
  return `${Math.round(kilometers)} km`;
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function joinMeta(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" · ");
}

export function formatRouteUpdated(isoDate: string, now: number) {
  const time = formatChatListTime(isoDate, now);
  return `updated ${time === "Yesterday" ? "yesterday" : time}`;
}

export function formatStopSubtitle(stop: RouteStopResponse, myId?: number) {
  const addedBy = stop.addedBy.id === myId ? "you" : stop.addedBy.firstName;
  const { osmKey, osmValue } = stop.place;
  return joinMeta(
    `Added by ${addedBy}`,
    osmKey && osmValue && formatOsmCategory(osmKey, osmValue),
  );
}
