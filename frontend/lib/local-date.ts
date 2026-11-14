const dayMonthFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const dayMonthYearFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toLocalDateString(date: Date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isLocalToday(date: string, now: number) {
  return date === toLocalDateString(new Date(now));
}

export function formatLocalDate(date: string, now: number) {
  const parsed = parseLocalDate(date);
  const sameYear = parsed.getFullYear() === new Date(now).getFullYear();
  return (sameYear ? dayMonthFormat : dayMonthYearFormat).format(parsed);
}

export function formatLocalDateWithYear(date: string) {
  return dayMonthYearFormat.format(parseLocalDate(date));
}
