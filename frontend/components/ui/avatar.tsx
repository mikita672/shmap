import * as React from "react";
import { View, Text as RNText } from "react-native";
import { Image, type ImageProps } from "expo-image";
import { cva, type VariantProps } from "class-variance-authority";
import { Ionicons } from "@/lib/icons";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center bg-muted/60 border border-border/40",
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
  "font-semibold text-on-surface select-none",
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

const avatarIconSizes: Record<AvatarSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 76,
};

type AvatarVariantProps = VariantProps<typeof avatarVariants>;
export type AvatarSize = NonNullable<AvatarVariantProps["size"]>;

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
      alt = "User avatar",
      textClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const avatarSize = size ?? "md";
    const [failedUri, setFailedUri] = React.useState<string | null>(null);

    const showDirectImage = Boolean(uri) && failedUri !== uri;
    const initials = React.useMemo(
      () => getInitials(fallbackText),
      [fallbackText],
    );

    return (
      <AvatarContext.Provider value={{ size: avatarSize }}>
        <View
          ref={ref}
          accessibilityRole="image"
          accessibilityLabel={alt}
          className={cn(avatarVariants({ size: avatarSize }), className)}
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
              name="person"
              size={avatarIconSizes[avatarSize]}
              className={cn("text-on-surface-muted", iconClassName)}
            />
          ) : (
            <RNText
              className={cn(
                avatarFallbackTextVariants({ size: avatarSize }),
                textClassName,
              )}
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
>(({ className, textClassName, children, ...props }, ref) => {
  const { size } = React.useContext(AvatarContext);

  return (
    <View
      ref={ref}
      className={cn(
        "h-full w-full items-center justify-center bg-muted/60",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <RNText
          className={cn(avatarFallbackTextVariants({ size }), textClassName)}
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
