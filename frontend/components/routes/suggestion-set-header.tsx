import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { formatTimeAgo } from "@/lib/time-ago";
import type { RouteSuggestionsResponse } from "@/lib/types/api";

const NOW_REFRESH_MS = 30_000;

export interface SuggestionSetHeaderProps {
  suggestions: RouteSuggestionsResponse;
  myId?: number;
}

export function SuggestionSetHeader({
  suggestions,
  myId,
}: SuggestionSetHeaderProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), NOW_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const { suggestedBy, suggestedAt, note } = suggestions;
  const who = suggestedBy.id === myId ? "you" : suggestedBy.firstName;
  const time = formatTimeAgo(suggestedAt, now);
  const when = time === "now" ? "just now" : `${time} ago`;

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-1.5">
        <MaterialIcons
          name="auto-awesome"
          size={18}
          className="text-brand dark:text-on-surface"
        />
        <Text className="text-sm font-medium leading-5 text-on-surface">
          AI suggestions
        </Text>
        <Text
          numberOfLines={1}
          className="flex-1 text-[13px] leading-[18px] text-on-surface-muted"
        >
          · Asked by {who} · {when}
        </Text>
      </View>
      {note && (
        <Text className="text-sm italic leading-5 text-secondary dark:text-on-surface">
          “{note}”
        </Text>
      )}
    </View>
  );
}
