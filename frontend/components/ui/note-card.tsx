import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface NoteCardProps {
  title: string;
  description: string;
  className?: string;
}

export function NoteCard({ title, description, className }: NoteCardProps) {
  return (
    <View
      className={cn(
        "items-center gap-1 rounded-[28px] bg-action px-6 py-5",
        className,
      )}
    >
      <Text className="text-center text-xl leading-7 tracking-[0.5px] text-action-foreground">
        {title}
      </Text>
      <Text className="text-center text-sm leading-5 tracking-[0.5px] text-secondary">
        {description}
      </Text>
    </View>
  );
}
