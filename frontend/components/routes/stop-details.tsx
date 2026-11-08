import { useState, type ReactNode } from "react";
import { View } from "react-native";
import { CopyPlaceButton, SharePlaceButton } from "@/components/place-actions";
import { PlaceAddress, PlaceHeader } from "@/components/place-info";
import { RoutePin } from "@/components/routes/route-pin";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { toPlaceDetails } from "@/lib/chat-place";
import { formatDayLabel, formatMessageTime } from "@/lib/chat-time";
import type { RouteStopResponse } from "@/lib/types/api";

export interface StopDetailsProps {
  stop: RouteStopResponse;
  number: number;
  onClose: () => void;
  removeAction?: ReactNode;
}

export function StopDetails({
  stop,
  number,
  onClose,
  removeAction,
}: StopDetailsProps) {
  const [now] = useState(() => Date.now());
  const place = toPlaceDetails(stop.place);
  const { addedBy } = stop;

  return (
    <View className="gap-3">
      <PlaceHeader
        place={place}
        leading={<RoutePin number={number} selected />}
        onClose={onClose}
      />

      <Separator />

      <PlaceAddress place={place} />

      <Separator />

      <View className="flex-row items-center gap-3">
        <Avatar uri={addedBy.avatarUrl} size={36} />
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className="text-sm font-medium leading-5 text-on-surface"
          >
            Added by {addedBy.firstName} {addedBy.lastName}
          </Text>
          <Text className="text-[13px] leading-[18px] text-on-surface-muted">
            {formatDayLabel(stop.addedAt, now)},{" "}
            {formatMessageTime(stop.addedAt)}
          </Text>
        </View>
      </View>

      <Separator />

      <View className="flex-row gap-3">
        {removeAction}
        <CopyPlaceButton place={place} />
        <SharePlaceButton place={place} />
      </View>
    </View>
  );
}
