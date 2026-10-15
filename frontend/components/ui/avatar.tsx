import { useState } from "react";
import { View, type ViewProps } from "react-native";
import { Ionicons } from "@/lib/icons";
import { Image } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends ViewProps {
  uri?: string | null;
  size?: number;
  iconClassName?: string;
}

export function Avatar({
  uri,
  size = 48,
  className,
  iconClassName,
  style,
  ...props
}: AvatarProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View
      className={cn(
        "items-center justify-center overflow-hidden rounded-full border border-border/40 bg-avatar",
        className,
      )}
      style={[{ width: size, height: size }, style]}
      {...props}
    >
      {uri && uri !== failedUri ? (
        <Image
          source={{ uri }}
          className="h-full w-full"
          contentFit="cover"
          transition={200}
          onError={() => setFailedUri(uri)}
        />
      ) : (
        <Ionicons
          name="person-circle-outline"
          size={size}
          className={cn("text-avatar-foreground", iconClassName)}
          style={{ lineHeight: size, includeFontPadding: false }}
        />
      )}
    </View>
  );
}
