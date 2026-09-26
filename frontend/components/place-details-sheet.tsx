import React, { useEffect, useCallback } from "react";
import { View, Pressable, Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Ionicons } from "@/lib/icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PlaceDetails } from "@/lib/api/geocoding";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function iconForCategory(osmKey?: string, osmValue?: string): IoniconsName {
  if (osmKey === "amenity") {
    const map: Record<string, IoniconsName> = {
      cafe: "cafe-outline",
      restaurant: "restaurant-outline",
      fast_food: "fast-food-outline",
      bar: "wine-outline",
      pub: "beer-outline",
      nightclub: "musical-notes-outline",
      pharmacy: "medkit-outline",
      hospital: "medical-outline",
      clinic: "medical-outline",
      doctors: "person-outline",
      dentist: "medical-outline",
      school: "school-outline",
      university: "school-outline",
      college: "school-outline",
      library: "library-outline",
      bank: "card-outline",
      atm: "card-outline",
      post_office: "mail-outline",
      police: "shield-outline",
      fire_station: "flame-outline",
      fuel: "car-outline",
      parking: "car-outline",
      bus_station: "bus-outline",
      ferry_terminal: "boat-outline",
      place_of_worship: "star-outline",
      theatre: "film-outline",
      cinema: "film-outline",
      townhall: "business-outline",
      courthouse: "business-outline",
      embassy: "flag-outline",
      marketplace: "storefront-outline",
    };
    const icon = osmValue && map[osmValue];
    return icon || "business-outline";
  }
  if (osmKey === "shop") return "storefront-outline";
  if (osmKey === "tourism") {
    if (osmValue === "museum") return "library-outline";
    if (osmValue === "hotel" || osmValue === "hostel" || osmValue === "motel")
      return "bed-outline";
    if (osmValue === "viewpoint") return "eye-outline";
    return "compass-outline";
  }
  if (osmKey === "leisure") {
    if (osmValue === "park" || osmValue === "garden") return "leaf-outline";
    if (osmValue === "stadium" || osmValue === "sports_centre")
      return "trophy-outline";
    if (osmValue === "swimming_pool") return "water-outline";
    return "football-outline";
  }
  if (osmKey === "highway") return "navigate-outline";
  if (osmKey === "railway") return "train-outline";
  if (osmKey === "aeroway") return "airplane-outline";
  if (osmKey === "natural") return "leaf-outline";
  if (osmKey === "place") return "location-outline";
  if (osmKey === "building") return "business-outline";
  return "location-outline";
}

function DragHandle() {
  return (
    <View className="items-center pt-2 pb-1">
      <View className="w-10 h-1 rounded-full bg-on-surface-muted/30" />
    </View>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={style}
      className={`bg-on-surface-muted/20 rounded-lg ${className ?? ""}`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <View className="px-5 pb-4 pt-2 gap-3">
      <View className="flex-row items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <View className="flex-1 gap-2">
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-3 w-1/3" />
        </View>
      </View>
      <Separator />

      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-2/3" />
      <Separator />
      <View className="flex-row gap-3">
        <SkeletonBlock className="flex-1 h-10 rounded-xl" />
        <SkeletonBlock className="flex-1 h-10 rounded-xl" />
      </View>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="px-5 pb-6 pt-2 items-center gap-4">
      <Ionicons
        name="alert-circle-outline"
        size={36}
        className="text-destructive"
      />
      <Text className="text-on-surface-muted text-sm text-center">
        Could not load place details.{"\n"}Check your connection and try again.
      </Text>
      <Button variant="outline" onPress={onRetry}>
        <Text>Retry</Text>
      </Button>
    </View>
  );
}

function CategoryBadge({
  label,
  osmKey,
  osmValue,
}: {
  label: string;
  osmKey?: string;
  osmValue?: string;
}) {
  const icon = iconForCategory(osmKey, osmValue);
  return (
    <View className="flex-row items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1 self-start">
      <Ionicons name={icon} size={13} className="text-primary" />
      <Text className="text-primary text-xs font-semibold">{label}</Text>
    </View>
  );
}

function AddressRow({ icon, text }: { icon: IoniconsName; text: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <Ionicons
        name={icon}
        size={16}
        className="text-on-surface-muted mt-0.5"
      />
      <Text className="text-on-surface text-sm flex-1 leading-5">{text}</Text>
    </View>
  );
}

function PlaceContent({
  place,
  onClose,
}: {
  place: PlaceDetails;
  onClose: () => void;
}) {
  const streetLine = [place.street, place.housenumber]
    .filter(Boolean)
    .join(" ");

  const localityLine = [place.locality, place.district]
    .filter(Boolean)
    .join(", ");

  const cityLine = [place.city, place.postcode, place.country]
    .filter(Boolean)
    .join(", ");

  const coordsText = `${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`;

  const fullAddress = [streetLine, localityLine, cityLine]
    .filter(Boolean)
    .join("\n");

  const copyText = [place.name, fullAddress || place.displayName, coordsText]
    .filter(Boolean)
    .join("\n");

  const shareText = [
    place.name,
    fullAddress || place.displayName,
    `Coordinates: ${coordsText}`,
    `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=17`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(copyText);
    toast.success("Copied to clipboard");
  }, [copyText]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: shareText, title: place.name });
    } catch (error: unknown) {
      if (error instanceof Error && error.message !== "User did not share") {
        toast.error("Unable to share");
      }
    }
  }, [shareText, place.name]);

  return (
    <View className="px-5 pb-4 pt-1 gap-3">
      {/* Header: icon + title + close */}
      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0 mt-0.5">
          <Ionicons
            name={iconForCategory(place.osmKey, place.osmValue)}
            size={20}
            className="text-primary"
          />
        </View>

        <View className="flex-1 gap-1">
          <Text
            className="text-on-surface text-base font-semibold leading-5"
            numberOfLines={2}
          >
            {place.name}
          </Text>
          <CategoryBadge
            label={place.category}
            osmKey={place.osmKey}
            osmValue={place.osmValue}
          />
        </View>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onPress={onClose}
          accessibilityLabel="Dismiss place details"
        >
          <Ionicons name="close" size={18} className="text-on-surface-muted" />
        </Button>
      </View>

      <Separator />

      <View className="gap-2">
        {streetLine ? (
          <AddressRow icon="location-outline" text={streetLine} />
        ) : null}
        {localityLine ? (
          <AddressRow icon="map-outline" text={localityLine} />
        ) : null}
        {cityLine ? (
          <AddressRow icon="business-outline" text={cityLine} />
        ) : null}
        <Pressable
          onPress={handleCopy}
          accessibilityLabel="Copy coordinates"
          className="flex-row items-start gap-3 active:opacity-60"
        >
          <Ionicons
            name="navigate-circle-outline"
            size={16}
            className="text-on-surface-muted mt-0.5"
          />
          <Text className="text-on-surface-muted text-sm font-mono flex-1">
            {coordsText}
          </Text>
          <Ionicons
            name="copy-outline"
            size={14}
            className="text-on-surface-muted mt-0.5"
          />
        </Pressable>
      </View>

      <Separator />

      <View className="flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onPress={handleCopy}
          accessibilityLabel="Copy place info"
        >
          <Ionicons name="copy-outline" size={16} className="text-on-surface" />
          <Text className="text-on-surface text-sm">Copy</Text>
        </Button>

        <Button
          variant="outline"
          className="flex-1 gap-2"
          onPress={handleShare}
          accessibilityLabel="Share place"
        >
          <Ionicons
            name="share-social-outline"
            size={16}
            className="text-on-surface"
          />
          <Text className="text-on-surface text-sm">Share</Text>
        </Button>
      </View>
    </View>
  );
}

export interface PlaceDetailsSheetProps {
  visible: boolean;
  place: PlaceDetails | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function PlaceDetailsSheet({
  visible,
  place,
  isLoading,
  isError,
  onClose,
  onRetry,
}: PlaceDetailsSheetProps) {
  const insets = useSafeAreaInsets();

  const sheetHeight = useSharedValue(0);

  const progress = useSharedValue(visible ? 0 : 1);

  useEffect(() => {
    if (visible) {
      progress.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      });
    } else {
      progress.value = withTiming(1, { duration: 250 });
    }
  }, [visible, progress]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * sheetHeight.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  return (
    <>
      <Animated.View
        style={[backdropStyle, { position: "absolute", inset: 0 }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable
          className="flex-1"
          onPress={onClose}
          accessibilityLabel="Close place details"
        />
      </Animated.View>

      <Animated.View
        style={[
          sheetStyle,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
        onLayout={(e) => {
          sheetHeight.value = e.nativeEvent.layout.height;
        }}
      >
        <View
          className="bg-surface rounded-t-3xl shadow-xl shadow-black/20 elevation-8"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <DragHandle />

          {isLoading && !place ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={onRetry} />
          ) : place ? (
            <PlaceContent place={place} onClose={onClose} />
          ) : null}
        </View>
      </Animated.View>
    </>
  );
}
