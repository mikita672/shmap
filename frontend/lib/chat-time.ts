const DAY = 24 * 60 * 60 * 1000;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const weekdayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const dayMonthFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const dayMonthYearFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function startOfDay(time: number) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function calendarDaysAgo(time: number, now: number) {
  return Math.round((startOfDay(now) - startOfDay(time)) / DAY);
}

export function formatChatListTime(isoDate: string, now: number) {
  const date = new Date(isoDate);
  const daysAgo = calendarDaysAgo(date.getTime(), now);

  if (daysAgo <= 0) return timeFormat.format(date);
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return weekdayFormat.format(date);
  if (date.getFullYear() === new Date(now).getFullYear()) {
    return dayMonthFormat.format(date);
  }
  return dayMonthYearFormat.format(date);
}
