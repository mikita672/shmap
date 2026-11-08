import React, { type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { copyText } from "@/components/place-actions";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { PlaceDetails } from "@/lib/api/geocoding";
import { Ionicons } from "@/lib/icons";
import { getPlaceLines } from "@/lib/place-format";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export function iconForCategory(
  osmKey?: string,
  osmValue?: string,
): IoniconsName {
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

export function PlaceCategoryIcon({ place }: { place: PlaceDetails }) {
  return (
    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0 mt-0.5">
      <Ionicons
        name={iconForCategory(place.osmKey, place.osmValue)}
        size={20}
        className="text-primary"
      />
    </View>
  );
}

export interface PlaceHeaderProps {
  place: PlaceDetails;
  leading: ReactNode;
  onClose: () => void;
}

export function PlaceHeader({ place, leading, onClose }: PlaceHeaderProps) {
  return (
    <View className="flex-row items-start gap-3">
      {leading}

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
  );
}

export function PlaceAddress({ place }: { place: PlaceDetails }) {
  const { streetLine, localityLine, cityLine, coordsText, fullAddress } =
    getPlaceLines(place);
  const fallbackAddress =
    !fullAddress && place.displayName !== coordsText ? place.displayName : null;

  return (
    <View className="gap-2">
      {streetLine ? (
        <AddressRow icon="location-outline" text={streetLine} />
      ) : null}
      {localityLine ? (
        <AddressRow icon="map-outline" text={localityLine} />
      ) : null}
      {cityLine ? <AddressRow icon="business-outline" text={cityLine} /> : null}
      {fallbackAddress ? (
        <AddressRow icon="location-outline" text={fallbackAddress} />
      ) : null}
      <Pressable
        onPress={() => copyText(coordsText)}
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
  );
}
