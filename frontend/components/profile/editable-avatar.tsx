import React from "react";
import {
  ActivityIndicator,
  View,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Avatar, type AvatarSize } from "@/components/ui/avatar";
import { Ionicons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface EditableAvatarProps {
  uri?: string | null;
  fallbackText?: string;
  size?: AvatarSize;
  isLoading?: boolean;
  onEdit?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function EditableAvatar({
  uri,
  fallbackText,
  size = "3xl",
  isLoading = false,
  onEdit,
  className,
  style,
}: EditableAvatarProps) {
  return (
    <View className={cn("relative self-center", className)} style={style}>
      <Pressable
        onPress={onEdit}
        disabled={isLoading}
        className="active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel="Change avatar"
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
      >
        <Avatar
          size={size}
          uri={uri}
          fallbackText={fallbackText}
          fallbackIcon={true}
        />
        {isLoading ? (
          <View className="absolute inset-0 rounded-full bg-black/40 items-center justify-center">
            <ActivityIndicator color="#fff" />
          </View>
        ) : null}
      </Pressable>

      <Pressable
        onPress={onEdit}
        disabled={isLoading}
        className={cn(
          "absolute bottom-1 right-1 h-11 w-11 rounded-full bg-primary items-center justify-center border-2 border-background shadow-md active:scale-95 transition-transform",
          isLoading && "opacity-50",
        )}
        accessibilityRole="button"
        accessibilityLabel="Edit avatar"
        accessibilityState={{ disabled: isLoading }}
      >
        <Ionicons name="pencil" size={20} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
