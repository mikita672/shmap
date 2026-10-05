import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import type { ImagePickerAsset } from "expo-image-picker";
import { toast } from "sonner-native";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { EditableAvatar } from "@/components/profile/editable-avatar";
import { ChangeAvatarSheet } from "@/components/profile/change-avatar-sheet";
import { useProfile } from "@/hooks/useProfile";
import {
  useChangeEmail,
  useRemoveAvatar,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/useProfileMutations";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import {
  useEditProfileForm,
  type ProfileChanges,
} from "@/hooks/useEditProfileForm";
import type { ProfileResponse } from "@/lib/types/api";
import { PROFILE_LIMITS } from "@/lib/validation/profile";
import { extractApiError, getErrorMessage } from "@/lib/utils/error";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile, isPending, error, refetch } = useProfile();

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center gap-4 px-6 bg-background">
        <BackButton
          className="absolute left-6"
          style={{ top: Math.max(insets.top + 8, 48) }}
        />
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your profile")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return <EditProfileForm profile={profile} />;
}

interface EditProfileFormProps {
  profile: ProfileResponse;
}

function EditProfileForm({ profile }: EditProfileFormProps) {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(insets.top + 8, 48);
  const updateProfile = useUpdateProfile();
  const changeEmail = useChangeEmail();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);

  const form = useEditProfileForm({
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    email: profile.email,
    bio: profile.bio ?? "",
  });
  const { values, errors, setField, markTouched } = form;
  const usernameAvailability = useUsernameAvailability(
    values.username,
    profile.username,
  );

  const lastNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  const saveProfile = async ({ email, ...fields }: ProfileChanges) => {
    if (Object.keys(fields).length > 0) {
      await updateProfile.mutateAsync(fields);
    }
    if (email !== undefined) {
      await changeEmail.mutateAsync({ email });
    }
  };

  const handlePickImage = (asset: ImagePickerAsset) => {
    uploadAvatar.mutate(asset, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.success("Avatar updated");
      },
      onError: (error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast.error(getErrorMessage(error, "Couldn't update your avatar"));
      },
    });
  };

  const handleRemoveAvatar = () => {
    removeAvatar.mutate(undefined, {
      onSuccess: () => toast.success("Avatar removed"),
      onError: (error) =>
        toast.error(getErrorMessage(error, "Couldn't remove your avatar")),
    });
  };

  const handleSave = async () => {
    try {
      const saved = await form.handleSubmit(saveProfile);
      if (!saved) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success("Profile updated");
      router.back();
    } catch (error) {
      const apiError = extractApiError(error);
      form.setServerErrors(apiError?.fieldErrors);
      toast.error(apiError?.message ?? "Could not update your profile");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View
        className="h-[52px] items-center justify-center"
        style={{ marginTop: headerTop }}
      >
        <Text
          role="heading"
          className="text-heading text-2xl leading-8 tracking-[0.5px]"
        >
          Edit profile
        </Text>
        <BackButton className="absolute left-6 top-0" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-3 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <EditableAvatar
          uri={profile.avatarUrl}
          fallbackText={`${values.firstName} ${values.lastName}`}
          isLoading={uploadAvatar.isPending || removeAvatar.isPending}
          onEdit={() => setAvatarSheetVisible(true)}
        />

        <View className="gap-3 mt-4">
          <View className="flex-row items-start gap-3">
            <TextField
              containerClassName="flex-1"
              label="First name"
              value={values.firstName}
              error={errors.firstName}
              onChangeText={(text) => setField("firstName", text)}
              onBlur={() => markTouched("firstName")}
              maxLength={PROFILE_LIMITS.nameMaxLength}
              autoComplete="given-name"
              autoCapitalize="words"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <TextField
              ref={lastNameRef}
              containerClassName="flex-1"
              label="Last name"
              value={values.lastName}
              error={errors.lastName}
              onChangeText={(text) => setField("lastName", text)}
              onBlur={() => markTouched("lastName")}
              maxLength={PROFILE_LIMITS.nameMaxLength}
              autoComplete="family-name"
              autoCapitalize="words"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => usernameRef.current?.focus()}
            />
          </View>

          <TextField
            ref={usernameRef}
            label="Username"
            value={values.username}
            error={
              errors.username ??
              (usernameAvailability.isTaken
                ? "This username is already taken"
                : undefined)
            }
            onChangeText={(text) => setField("username", text)}
            onBlur={() => markTouched("username")}
            maxLength={PROFILE_LIMITS.usernameMaxLength}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <TextField
            ref={emailRef}
            label="Email"
            value={values.email}
            error={errors.email}
            onChangeText={(text) => setField("email", text)}
            onBlur={() => markTouched("email")}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => bioRef.current?.focus()}
          />

          <TextField
            ref={bioRef}
            label="Bio"
            value={values.bio}
            error={errors.bio}
            onChangeText={(text) => setField("bio", text)}
            onBlur={() => markTouched("bio")}
            placeholder="Tell others a little about yourself"
            multiline
            maxLength={PROFILE_LIMITS.bioMaxLength}
            showCount
          />
        </View>
      </ScrollView>

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          onPress={handleSave}
          disabled={
            !form.isDirty ||
            form.isSubmitting ||
            usernameAvailability.isChecking ||
            usernameAvailability.isTaken
          }
        >
          <Text className="text-2xl">
            {form.isSubmitting ? "Saving…" : "Save changes"}
          </Text>
        </Button>
      </View>

      <ChangeAvatarSheet
        visible={avatarSheetVisible}
        onClose={() => setAvatarSheetVisible(false)}
        onPickImage={handlePickImage}
        onRemove={handleRemoveAvatar}
        hasCurrentAvatar={Boolean(profile.avatarUrl)}
      />
    </KeyboardAvoidingView>
  );
}
