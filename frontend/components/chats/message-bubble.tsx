import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  text: string;
  time: string;
  isMine: boolean;
  senderName?: string;
}

export function MessageBubble({
  text,
  time,
  isMine,
  senderName,
}: MessageBubbleProps) {
  return (
    <View
      className={cn(
        "max-w-[288px] gap-0.5 rounded-[18px] px-3 pb-1.5 pt-2",
        isMine ? "rounded-br-md bg-bubble-out" : "rounded-bl-md bg-bubble-in",
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
      <Text
        className={cn(
          "self-end text-xs leading-4",
          isMine ? "text-bubble-out-muted opacity-80" : "text-bubble-in-muted",
        )}
      >
        {time}
      </Text>
    </View>
  );
}
