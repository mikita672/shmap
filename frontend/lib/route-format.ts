import { formatOsmCategory } from "@/lib/api/geocoding";
import { formatChatListTime } from "@/lib/chat-time";
import {
  formatLocalDate,
  formatLocalDateWithYear,
  isLocalToday,
} from "@/lib/local-date";
import type {
  RouteCompletionResponse,
  RouteStopResponse,
  RouteVisibility,
  TravelMode,
  UserSummaryResponse,
} from "@/lib/types/api";

export const MAX_ROUTE_STOPS = 10;
export const MIN_STOPS_TO_FINISH = 2;

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

export const VISIBILITY_OPTIONS: {
  value: RouteVisibility;
  title: string;
  description: string;
}[] = [
  {
    value: "PARTICIPANTS",
    title: "Only participants",
    description: "Only people who took part",
  },
  {
    value: "FRIENDS",
    title: "Friends of participants",
    description: "Participants and their friends",
  },
  {
    value: "EVERYONE",
    title: "Everyone",
    description: "Anyone on Shmap",
  },
];

export function formatDoneTitle(finishedOn: string) {
  return `Done · ${formatLocalDateWithYear(finishedOn)}`;
}

export function formatDoneMeta(finishedOn: string, now: number) {
  return `Done ${formatLocalDate(finishedOn, now)}`;
}

export function formatDateRowValue(finishedOn: string, now: number) {
  const date = formatLocalDateWithYear(finishedOn);
  return isLocalToday(finishedOn, now) ? `Today · ${date}` : date;
}

export function formatParticipants(
  participants: UserSummaryResponse[],
  myId?: number,
) {
  const names = participants
    .filter((participant) => participant.id !== myId)
    .map((participant) => participant.firstName);
  if (participants.some((participant) => participant.id === myId)) {
    names.push("you");
  }

  if (names.length === 0) return "";
  if (names.length === 1) return names[0] === "you" ? "You" : names[0];
  if (names.length <= 3) {
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  }
  return `${names.slice(0, 2).join(", ")} and ${names.length - 2} others`;
}

export function formatVisibility(completion: RouteCompletionResponse) {
  const limited =
    completion.visibility === "EVERYONE" &&
    completion.effectiveVisibility === "FRIENDS";
  if (limited) {
    return {
      line: "Visible to everyone, limited to friends",
      note: "A participant's account is private",
    };
  }

  const lines: Record<RouteVisibility, string> = {
    PARTICIPANTS: "Visible to participants only",
    FRIENDS: "Visible to friends of participants",
    EVERYONE: "Visible to everyone",
  };
  return { line: lines[completion.effectiveVisibility], note: null };
}
