import { View } from "react-native";
import { MapPreview } from "@/components/map-preview";
import { Text } from "@/components/ui/text";
import type { ChatPlace } from "@/lib/types/api";

const THUMBNAIL_SIZE = 56;

export function PlaceSummary({ place }: { place: ChatPlace }) {
  return (
    <View className="flex-row items-center gap-3 rounded-[32px] bg-action py-2 pl-2 pr-5">
      <MapPreview
        latitude={place.latitude}
        longitude={place.longitude}
        width={THUMBNAIL_SIZE}
        height={THUMBNAIL_SIZE}
        pinSize={28}
        className="rounded-full"
      />
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-base font-medium leading-6 text-action-foreground"
        >
          {place.name}
        </Text>
        {place.address ? (
          <Text numberOfLines={1} className="text-sm leading-5 text-secondary">
            {place.address}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
