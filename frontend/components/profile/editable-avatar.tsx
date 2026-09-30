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
  size = "3xl",
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
        <Avatar
          size={size}
          uri={uri}
          fallbackText={fallbackText}
          fallbackIcon={true}
        />
      </Pressable>

      <Pressable
        onPress={onEdit}
        className="absolute bottom-1 right-1 h-11 w-11 rounded-full bg-primary items-center justify-center border-2 border-background shadow-md active:scale-95 transition-transform"
        accessibilityRole="button"
        accessibilityLabel="Edit avatar"
      >
        <Ionicons name="pencil" size={20} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
