import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  text: string;
  time: string;
  isMine: boolean;
}

export function MessageBubble({ text, time, isMine }: MessageBubbleProps) {
  return (
    <View
      className={cn(
        "max-w-[288px] gap-0.5 rounded-[18px] px-3 pb-1.5 pt-2",
        isMine
          ? "self-end rounded-br-md bg-bubble-out"
          : "self-start rounded-bl-md bg-bubble-in",
      )}
    >
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
