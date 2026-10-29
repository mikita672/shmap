import { Share } from "react-native";
import { toast } from "sonner-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { PlaceDetails } from "@/lib/api/geocoding";
import { Ionicons, MaterialIcons } from "@/lib/icons";
import { getPlaceCopyText, getPlaceShareText } from "@/lib/place-format";

export async function copyPlace(place: PlaceDetails) {
  try {
    const Clipboard = await import("expo-clipboard");
    await Clipboard.setStringAsync(getPlaceCopyText(place));
    toast.success("Copied to clipboard");
  } catch (error) {
    toast.error("Clipboard requires app rebuild");
    console.warn(
      "expo-clipboard native module missing. Rebuild your app.",
      error,
    );
  }
}

export async function sharePlace(place: PlaceDetails) {
  try {
    await Share.share({ message: getPlaceShareText(place), title: place.name });
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== "User did not share") {
      toast.error("Unable to share");
    }
  }
}

export function CopyPlaceButton({ place }: { place: PlaceDetails }) {
  return (
    <Button
      variant="outline"
      className="flex-1 gap-2"
      onPress={() => copyPlace(place)}
      accessibilityLabel="Copy place info"
    >
      <Ionicons name="copy-outline" size={16} className="text-on-surface" />
      <Text className="text-on-surface text-sm">Copy</Text>
    </Button>
  );
}

export function SharePlaceButton({ place }: { place: PlaceDetails }) {
  return (
    <Button
      variant="outline"
      className="flex-1 gap-2"
      onPress={() => sharePlace(place)}
      accessibilityLabel="Share place"
    >
      <Ionicons
        name="share-social-outline"
        size={16}
        className="text-on-surface"
      />
      <Text className="text-on-surface text-sm">Share</Text>
    </Button>
  );
}

export interface SendPlaceButtonProps {
  label?: string;
  disabled?: boolean;
  onPress: () => void;
}

export function SendPlaceButton({
  label = "Send",
  disabled,
  onPress,
}: SendPlaceButtonProps) {
  return (
    <Button
      className="flex-1 gap-2"
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <MaterialIcons
        name="send"
        size={16}
        className="text-primary-foreground"
      />
      <Text className="text-sm">{label}</Text>
    </Button>
  );
}
