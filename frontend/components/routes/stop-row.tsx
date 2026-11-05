import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { RoutePin } from "@/components/routes/route-pin";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface StopRowProps {
  number: number;
  name: string;
  subtitle: string;
  lineAbove: boolean;
  lineBelow: boolean;
  dragging?: boolean;
  trailing?: ReactNode;
  onPress?: () => void;
}

export function StopRow({
  number,
  name,
  subtitle,
  lineAbove,
  lineBelow,
  dragging = false,
  trailing,
  onPress,
}: StopRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Stop ${number}: ${name}`}
      className={cn(
        "h-16 flex-row items-center gap-3 active:opacity-80",
        dragging &&
          "rounded-2xl bg-surface px-2 shadow-lg shadow-black/25 elevation-6",
      )}
    >
      <View className="h-16 w-7 items-center justify-center">
        {lineAbove && (
          <View className="absolute top-0 h-[18px] w-0.5 bg-map-pin/45" />
        )}
        {lineBelow && (
          <View className="absolute bottom-0 h-[18px] w-0.5 bg-map-pin/45" />
        )}
        <RoutePin number={number} />
      </View>

      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          numberOfLines={1}
          className="text-base font-medium leading-[22px] text-on-surface"
        >
          {name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-[13px] leading-[18px] text-on-surface-muted"
        >
          {subtitle}
        </Text>
      </View>

      {trailing}
    </Pressable>
  );
}

export function StopDragHandle() {
  return (
    <View
      accessibilityLabel="Drag to reorder"
      className="h-10 w-10 items-center justify-center"
    >
      <MaterialIcons
        name="drag-handle"
        size={24}
        className="text-on-surface-muted"
      />
    </View>
  );
}
