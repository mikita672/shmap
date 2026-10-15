import { useState } from "react";
import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { AccountCircleIcon } from "@/components/ui/account-circle-icon";
import { Image } from "@/lib/image";
import { cn } from "@/lib/utils";

const ICON_TO_AVATAR_RATIO = 45 / 48;

const avatarVariants = cva(
  "items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      tone: {
        background: "bg-avatar",
        surface: "bg-avatar-surface",
      },
    },
    defaultVariants: {
      tone: "background",
    },
  },
);

const avatarIconVariants = cva("", {
  variants: {
    tone: {
      background: "text-avatar-foreground",
      surface: "text-avatar-surface-foreground",
    },
  },
  defaultVariants: {
    tone: "background",
  },
});

export interface AvatarProps
  extends ViewProps, VariantProps<typeof avatarVariants> {
  uri?: string | null;
  size?: number;
  iconClassName?: string;
}

export function Avatar({
  uri,
  size = 48,
  tone,
  className,
  iconClassName,
  style,
  ...props
}: AvatarProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View
      className={cn(avatarVariants({ tone }), className)}
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
          className={cn(avatarIconVariants({ tone }), iconClassName)}
        />
      )}
    </View>
  );
}
