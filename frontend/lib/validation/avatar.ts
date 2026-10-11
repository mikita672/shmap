export const AVATAR_LIMITS = {
  maxSizeBytes: 5 * 1024 * 1024,
} as const;

const AVATAR_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateAvatar(
  contentType: string,
  sizeBytes: number,
): string | undefined {
  if (!AVATAR_CONTENT_TYPES.has(contentType))
    return "Avatar must be a JPEG, PNG or WebP image";
  if (sizeBytes <= 0) return "Couldn't read the selected image";
  if (sizeBytes > AVATAR_LIMITS.maxSizeBytes)
    return `Avatar must be at most ${AVATAR_LIMITS.maxSizeBytes / (1024 * 1024)} MB`;
}
