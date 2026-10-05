import { Modal, View, Text, Pressable, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { toast } from "sonner-native";

interface ChangeAvatarSheetProps {
  visible: boolean;
  onClose: () => void;
  onPickImage: (asset: ImagePicker.ImagePickerAsset) => void;
  onRemove: () => void;
  hasCurrentAvatar: boolean;
}

export function ChangeAvatarSheet({
  visible,
  onClose,
  onPickImage,
  onRemove,
  hasCurrentAvatar,
}: ChangeAvatarSheetProps) {
  const handlePickFromLibrary = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant media library access in your system settings to choose a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onPickImage(result.assets[0]);
        onClose();
      }
    } catch (err) {
      console.error("Failed to pick image:", err);
      toast.error("Failed to pick image");
    }
  };

  const handleTakePhoto = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant camera access in your system settings to take a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onPickImage(result.assets[0]);
        onClose();
      }
    } catch (err) {
      console.error("Failed to take photo:", err);
      toast.error("Failed to take photo");
    }
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRemove();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable
          className="bg-surface rounded-t-3xl p-6 pb-10 border-t border-border/50 gap-4"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center mb-1">
            <View className="w-12 h-1.5 bg-muted rounded-full mb-3" />
            <Text className="text-foreground text-lg font-bold">
              Change Profile Photo
            </Text>
            <Text className="text-on-surface-muted text-xs mt-0.5">
              Choose an image for your profile and map marker
            </Text>
          </View>

          <View className="gap-2">
            <Pressable
              className="flex-row items-center p-3.5 rounded-2xl bg-muted/40 active:bg-muted"
              onPress={handlePickFromLibrary}
            >
              <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3.5">
                <Ionicons
                  name="images-outline"
                  size={20}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">
                  Choose from Library
                </Text>
                <Text className="text-on-surface-muted text-xs">
                  Pick a photo from your gallery
                </Text>
              </View>
            </Pressable>

            <Pressable
              className="flex-row items-center p-3.5 rounded-2xl bg-muted/40 active:bg-muted"
              onPress={handleTakePhoto}
            >
              <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3.5">
                <Ionicons
                  name="camera-outline"
                  size={20}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">
                  Take Photo
                </Text>
                <Text className="text-on-surface-muted text-xs">
                  Capture a new picture using camera
                </Text>
              </View>
            </Pressable>

            {hasCurrentAvatar && (
              <Pressable
                className="flex-row items-center p-3.5 rounded-2xl bg-destructive/10 active:bg-destructive/20"
                onPress={handleRemove}
              >
                <View className="h-10 w-10 rounded-full bg-destructive/20 items-center justify-center mr-3.5">
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    className="text-destructive"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-destructive font-semibold text-base">
                    Remove Photo
                  </Text>
                  <Text className="text-destructive/70 text-xs">
                    Reset to default initials
                  </Text>
                </View>
              </Pressable>
            )}
          </View>

          <Pressable
            className="p-3.5 rounded-2xl bg-muted/60 active:bg-muted items-center mt-1"
            onPress={onClose}
          >
            <Text className="text-foreground font-medium text-base">
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
