import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";
import type { UserProfile } from "@/hooks/useUserProfile";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (changes: Partial<UserProfile>) => void;
}

function EditProfileContent({
  onClose,
  profile,
  onSave,
}: Omit<EditProfileModalProps, "visible">) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);

  const handleSave = () => {
    if (!firstName.trim()) {
      toast.error("First name cannot be empty");
      return;
    }
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
    });
    toast.success("Profile updated!");
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black/60 justify-end"
    >
      <View className="bg-surface rounded-t-3xl max-h-[90%] border-t border-border/50">
        <View className="flex-row items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
          <Pressable onPress={onClose} className="p-1">
            <Text className="text-on-surface-muted text-base">Cancel</Text>
          </Pressable>
          <Text className="text-foreground text-lg font-bold">
            Edit Profile
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={handleSave}
            className="px-2"
          >
            <Text className="text-primary font-bold text-base">Save</Text>
          </Button>
        </View>

        <ScrollView
          contentContainerClassName="p-6 gap-5 pb-12"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row gap-3">
            <View className="flex-1 gap-1.5">
              <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
                First Name
              </Text>
              <Input
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                className="rounded-xl h-12"
              />
            </View>

            <View className="flex-1 gap-1.5">
              <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
                Last Name
              </Text>
              <Input
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                className="rounded-xl h-12"
              />
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
              Username
            </Text>
            <View className="flex-row items-center bg-muted/40 rounded-xl px-3 border border-border/30">
              <Text className="text-on-surface-muted text-base mr-1">@</Text>
              <Input
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="username"
                className="flex-1 border-0 bg-transparent shadow-none h-12"
              />
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Text>
            <Input
              value={profile.email}
              editable={false}
              className="rounded-xl h-12 opacity-60 bg-muted/30"
            />
            <Text className="text-on-surface-muted text-[11px] px-1">
              Email changes will be available via account verification settings.
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
              Bio
            </Text>
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio about yourself..."
              multiline
              numberOfLines={3}
              className="rounded-xl h-24 py-3 text-top"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export function EditProfileModal({
  visible,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {visible ? (
        <EditProfileContent
          onClose={onClose}
          profile={profile}
          onSave={onSave}
        />
      ) : null}
    </Modal>
  );
}
