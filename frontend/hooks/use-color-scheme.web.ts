import { useTheme } from "@/hooks/useTheme";

export function useColorScheme() {
  return useTheme().colorScheme;
}
