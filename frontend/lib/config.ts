if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL environment variable is missing.");
}

export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_URL;
