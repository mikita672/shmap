import * as React from "react";
import { View, Text as RNText, type LayoutChangeEvent } from "react-native";
import { Image, type ImageProps } from "expo-image";
import { cva, type VariantProps } from "class-variance-authority";
import { Ionicons } from "@/lib/icons";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center bg-avatar border border-border/40",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-24 w-24",
        "3xl": "h-32 w-32",
        "4xl": "h-36 w-36",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const avatarFallbackTextVariants = cva(
  "font-semibold text-avatar-foreground select-none",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-xl font-bold",
        "2xl": "text-3xl font-bold",
        "3xl": "text-4xl font-bold",
        "4xl": "text-5xl font-bold",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const AVATAR_COLORS = {
  light: {
    bg: "hsl(43, 81%, 88%)", // Lemon Meringue
    icon: "hsl(93.1, 15.03%, 37.84%)", // Dark Olive Green
  },
  dark: {
    bg: "hsl(93.1, 15.03%, 37.84%)", // Dark Olive Green
    icon: "hsl(43, 81%, 88%)", // Lemon Meringue
  },
} as const;

function useSafeTheme() {
  try {
    return useTheme();
  } catch {
    return { isDark: false };
  }
}

type AvatarVariantProps = VariantProps<typeof avatarVariants>;
export type AvatarSize = NonNullable<AvatarVariantProps["size"]>;

/** Full available container pixel diameter for each preset avatar size */
const avatarPixelSizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  "2xl": 96,
  "3xl": 128,
  "4xl": 144,
};

const AvatarContext = React.createContext<{
  size: AvatarSize;
}>({
  size: "md",
});

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof View>, AvatarVariantProps {
  uri?: string | null;
  fallbackText?: string;
  fallbackIcon?: boolean;
  iconClassName?: string;
  iconColor?: string;
  iconSize?: number;
  alt?: string;
  textClassName?: string;
}

function getInitials(text?: string): string {
  if (!text) return "";
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const Avatar = React.forwardRef<React.ElementRef<typeof View>, AvatarProps>(
  (
    {
      className,
      size = "md",
      uri,
      fallbackText,
      fallbackIcon = false,
      iconClassName,
      iconColor,
      iconSize: customIconSize,
      alt = "User avatar",
      textClassName,
      style,
      onLayout,
      children,
      ...props
    },
    ref,
  ) => {
    const avatarSize = size ?? "md";
    const [failedUri, setFailedUri] = React.useState<string | null>(null);
    const [layoutSize, setLayoutSize] = React.useState<number | null>(null);

    const { isDark } = useSafeTheme();
    const themeColors = isDark ? AVATAR_COLORS.dark : AVATAR_COLORS.light;
    const resolvedIconColor = iconColor ?? themeColors.icon;

    const handleLayout = React.useCallback(
      (e: LayoutChangeEvent) => {
        onLayout?.(e);
        const { width, height } = e.nativeEvent.layout;
        const minDim = Math.round(Math.min(width, height));
        if (minDim > 0 && minDim !== layoutSize) {
          setLayoutSize(minDim);
        }
      },
      [onLayout, layoutSize],
    );

    const effectiveIconSize =
      customIconSize ?? layoutSize ?? avatarPixelSizes[avatarSize];

    const showDirectImage = Boolean(uri) && failedUri !== uri;
    const initials = React.useMemo(
      () => getInitials(fallbackText),
      [fallbackText],
    );

    const hasCustomBg =
      className?.includes("bg-") && !className?.includes("bg-avatar");
    const resolvedBgStyle = hasCustomBg
      ? undefined
      : { backgroundColor: themeColors.bg };

    return (
      <AvatarContext.Provider value={{ size: avatarSize }}>
        <View
          ref={ref}
          accessibilityRole="image"
          accessibilityLabel={alt}
          onLayout={handleLayout}
          className={cn(avatarVariants({ size: avatarSize }), className)}
          style={[resolvedBgStyle, style]}
          {...props}
        >
          {children ? (
            children
          ) : showDirectImage ? (
            <Image
              source={{ uri: uri! }}
              className="h-full w-full"
              contentFit="cover"
              transition={200}
              onError={() => setFailedUri(uri ?? null)}
            />
          ) : fallbackIcon || !initials ? (
            <Ionicons
              name="person-circle-outline"
              size={effectiveIconSize}
              color={resolvedIconColor}
              className={cn("text-avatar-foreground", iconClassName)}
              style={{ textAlign: "center" }}
            />
          ) : (
            <RNText
              className={cn(
                avatarFallbackTextVariants({ size: avatarSize }),
                textClassName,
              )}
              style={{ color: resolvedIconColor }}
            >
              {initials}
            </RNText>
          )}
        </View>
      </AvatarContext.Provider>
    );
  },
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends ImageProps {
  className?: string;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof Image>,
  AvatarImageProps
>(({ className, contentFit = "cover", transition = 200, ...props }, ref) => {
  return (
    <Image
      ref={ref}
      contentFit={contentFit}
      transition={transition}
      className={cn("h-full w-full", className)}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  className?: string;
  textClassName?: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof View>,
  AvatarFallbackProps
>(({ className, textClassName, style, children, ...props }, ref) => {
  const { size } = React.useContext(AvatarContext);
  const { isDark } = useSafeTheme();
  const themeColors = isDark ? AVATAR_COLORS.dark : AVATAR_COLORS.light;

  const hasCustomBg =
    className?.includes("bg-") && !className?.includes("bg-avatar");
  const resolvedBgStyle = hasCustomBg
    ? undefined
    : { backgroundColor: themeColors.bg };

  return (
    <View
      ref={ref}
      className={cn(
        "h-full w-full items-center justify-center bg-avatar",
        className,
      )}
      style={[resolvedBgStyle, style]}
      {...props}
    >
      {typeof children === "string" ? (
        <RNText
          className={cn(avatarFallbackTextVariants({ size }), textClassName)}
          style={{ color: themeColors.icon }}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
});

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
