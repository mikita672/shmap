import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  text: string;
  time?: string;
  isMine: boolean;
  isPending?: boolean;
  isFailed?: boolean;
  senderName?: string;
}

export function MessageBubble({
  text,
  time,
  isMine,
  isPending = false,
  isFailed = false,
  senderName,
}: MessageBubbleProps) {
  return (
    <View
      className={cn(
        "max-w-[288px] gap-0.5 rounded-[18px] px-3 pb-1.5 pt-2",
        isMine ? "rounded-br-md bg-bubble-out" : "rounded-bl-md bg-bubble-in",
        isPending && "opacity-60",
        isFailed && "opacity-80",
      )}
    >
      {senderName ? (
        <Text className="text-sm font-medium leading-5 text-bubble-sender">
          {senderName}
        </Text>
      ) : null}
      <Text
        className={cn(
          "text-base leading-[22px]",
          isMine ? "text-bubble-out-foreground" : "text-bubble-in-foreground",
        )}
      >
        {text}
      </Text>
      {isFailed ? (
        <Text className="self-end text-xs font-medium leading-4 text-bubble-out-foreground">
          Not sent · Tap to retry
        </Text>
      ) : isPending ? (
        <MaterialIcons
          name="schedule"
          size={14}
          accessibilityLabel="Sending"
          className="self-end text-bubble-out-muted"
        />
      ) : (
        <Text
          className={cn(
            "self-end text-xs leading-4",
            isMine
              ? "text-bubble-out-muted opacity-80"
              : "text-bubble-in-muted",
          )}
        >
          {time}
        </Text>
      )}
    </View>
  );
}
