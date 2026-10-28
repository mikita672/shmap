export function parseMemberIds(raw?: string): number[] {
  if (!raw) {
    return [];
  }
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(Number).filter((n) => !Number.isNaN(n) && n > 0);
      }
    }
    return raw
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n) && n > 0);
  } catch {
    return [];
  }
}
