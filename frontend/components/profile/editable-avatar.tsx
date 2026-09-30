import React from "react";
import { View, Pressable, type StyleProp, type ViewStyle } from "react-native";
import { Avatar, type AvatarSize } from "@/components/ui/avatar";
import { Ionicons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface EditableAvatarProps {
  uri?: string | null;
  fallbackText?: string;
  size?: AvatarSize;
  onEdit?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function EditableAvatar({
  uri,
  fallbackText,
  size = "2xl",
  onEdit,
  className,
  style,
}: EditableAvatarProps) {
  return (
    <View className={cn("relative self-center", className)} style={style}>
      <Pressable
        onPress={onEdit}
        className="active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel="Change avatar"
      >
        <Avatar size={size} uri={uri} fallbackText={fallbackText} />
      </Pressable>

      <Pressable
        onPress={onEdit}
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center shadow-sm active:scale-95 transition-transform"
        accessibilityRole="button"
        accessibilityLabel="Edit avatar"
      >
        <Ionicons name="pencil" size={16} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
