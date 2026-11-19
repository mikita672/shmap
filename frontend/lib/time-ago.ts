import { calendarDaysAgo } from "@/lib/chat-time";
import { formatLocalDate, toLocalDateString } from "@/lib/local-date";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY;

export function formatTimeAgo(isoDate: string, now: number) {
  const elapsed = Math.max(0, now - new Date(isoDate).getTime());

  if (elapsed < MINUTE) return "now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;
  if (elapsed < WEEK) return `${Math.floor(elapsed / DAY)}d`;
  if (elapsed < YEAR) return `${Math.floor(elapsed / WEEK)}w`;
  return `${Math.floor(elapsed / YEAR)}y`;
}

export function formatFeedTime(isoDate: string, now: number) {
  const time = new Date(isoDate).getTime();
  const elapsed = Math.max(0, now - time);

  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;

  const daysAgo = calendarDaysAgo(time, now);
  if (daysAgo <= 1) return "yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  return formatLocalDate(toLocalDateString(new Date(time)), now);
}
