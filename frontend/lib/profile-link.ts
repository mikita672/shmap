export function getProfileUrl(username: string): string {
  return `https://shmap.app/u/${encodeURIComponent(username)}`;
}
