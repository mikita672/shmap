import { formatChatListTime } from "@/lib/chat-time";
import type { TravelMode } from "@/lib/types/api";

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  WALKING: "Walking",
  DRIVING: "Driving",
};

export function formatStopCount(count: number) {
  if (count === 0) return "No stops";
  return count === 1 ? "1 stop" : `${count} stops`;
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
