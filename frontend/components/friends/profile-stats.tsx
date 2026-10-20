import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface ProfileStat {
  value: string;
  label: string;
  onPress?: () => void;
}

export interface ProfileStatsProps {
  stats: ProfileStat[];
  className?: string;
}

export function ProfileStats({ stats, className }: ProfileStatsProps) {
  return (
    <View className={cn("flex-row rounded-[28px] bg-action py-3.5", className)}>
      {stats.map((stat) => (
        <Pressable
          key={stat.label}
          onPress={stat.onPress}
          disabled={!stat.onPress}
          accessibilityRole={stat.onPress ? "button" : undefined}
          className="flex-1 items-center gap-0.5 active:opacity-60"
        >
          <Text className="text-2xl leading-8 tracking-[0.5px] text-action-foreground">
            {stat.value}
          </Text>
          <Text className="text-sm leading-5 tracking-[0.5px] text-secondary">
            {stat.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
