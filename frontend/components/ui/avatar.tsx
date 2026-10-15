import { useState } from "react";
import { View, type ViewProps } from "react-native";
import { AccountCircleIcon } from "@/components/ui/account-circle-icon";
import { Image } from "@/lib/image";
import { cn } from "@/lib/utils";

const ICON_TO_AVATAR_RATIO = 45 / 48;

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
        "items-center justify-center overflow-hidden rounded-full bg-avatar",
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
        <AccountCircleIcon
          size={size * ICON_TO_AVATAR_RATIO}
          className={cn("text-avatar-foreground", iconClassName)}
        />
      )}
    </View>
  );
}
