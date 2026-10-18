import { useEffect, useRef } from "react";
import { AppState, Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { ViewfinderOverlay } from "@/components/scan/viewfinder-overlay";
import { getProfileHref, parseProfileLink } from "@/lib/profile-link";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const isLockedRef = useRef(false);
  const lastRejectedRef = useRef<string | null>(null);

  function handleBarcodeScanned({ data }: BarcodeScanningResult) {
    if (isLockedRef.current) {
      return;
    }

    const username = parseProfileLink(data);
    if (!username) {
      if (lastRejectedRef.current !== data) {
        lastRejectedRef.current = data;
        toast.error("That's not a Shmap QR code");
      }
      return;
    }

    isLockedRef.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(getProfileHref(username));
  }

  useEffect(() => {
    if (permission?.status === "undetermined") {
      requestPermission();
    }
  }, [permission?.status, requestPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        getPermission();
      }
    });
    return () => subscription.remove();
  }, [getPermission]);

  const closeButton = (
    <RoundButton
      icon="close"
      accessibilityLabel="Close scanner"
      onPress={() => router.back()}
      className="absolute left-6 z-10"
      style={{ top: insets.top + 12 }}
    />
  );

  if (permission?.status === "denied") {
    return (
      <View className="flex-1 justify-center gap-6 bg-background px-6">
        {closeButton}
        <NoteCard
          title="Camera access needed"
          description="Allow camera access in Settings to scan Shmap QR codes."
        />
        <Button
          size="xl"
          onPress={() =>
            permission.canAskAgain
              ? requestPermission()
              : Linking.openSettings()
          }
        >
          <Text className="text-2xl">
            {permission.canAskAgain ? "Allow camera" : "Open settings"}
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      {permission?.granted && (
        <>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <ViewfinderOverlay />
        </>
      )}
      {closeButton}
    </View>
  );
}
