import { View, type ViewProps } from "react-native";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

const GLYPH_TO_AVATAR_RATIO = 0.5;

export interface GroupAvatarProps extends ViewProps {
  size?: number;
}

export function GroupAvatar({
  size = 48,
  className,
  style,
  ...props
}: GroupAvatarProps) {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-full bg-avatar-surface",
        className,
      )}
      style={[{ width: size, height: size }, style]}
      {...props}
    >
      <MaterialIcons
        name="groups"
        size={size * GLYPH_TO_AVATAR_RATIO}
        className="text-avatar-surface-foreground"
      />
    </View>
  );
}
