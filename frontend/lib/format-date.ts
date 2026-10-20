const monthYearFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatMonthYear(isoDate: string) {
  return monthYearFormat.format(new Date(isoDate));
}
