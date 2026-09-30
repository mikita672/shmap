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
import { Ionicons } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onChangePassword?: (currentPass: string, newPass: string) => void;
}

export function ChangePasswordModal({
  visible,
  onClose,
  onChangePassword,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChangePassword?.(currentPassword, newPassword);
    toast.success("Password changed successfully!");
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-surface rounded-t-3xl max-h-[90%] border-t border-border/50">
          <View className="flex-row items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
            <Pressable onPress={handleClose} className="p-1">
              <Text className="text-on-surface-muted text-base">Cancel</Text>
            </Pressable>
            <Text className="text-foreground text-lg font-bold">
              Change Password
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleSubmit}
              className="px-2"
            >
              <Text className="text-primary font-bold text-base">Update</Text>
            </Button>
          </View>

          <ScrollView
            contentContainerClassName="p-6 gap-5 pb-12"
            keyboardShouldPersistTaps="handled"
          >
            <View className="gap-1.5">
              <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
                Current Password
              </Text>
              <View className="flex-row items-center bg-muted/40 rounded-xl px-3 border border-border/30">
                <Input
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  placeholder="Enter current password"
                  className="flex-1 border-0 bg-transparent shadow-none h-12"
                />
                <Pressable
                  onPress={() => setShowCurrent(!showCurrent)}
                  className="p-2"
                  accessibilityLabel="Toggle current password visibility"
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    className="text-on-surface-muted"
                  />
                </Pressable>
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
                New Password
              </Text>
              <View className="flex-row items-center bg-muted/40 rounded-xl px-3 border border-border/30">
                <Input
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="At least 8 characters"
                  className="flex-1 border-0 bg-transparent shadow-none h-12"
                />
                <Pressable
                  onPress={() => setShowNew(!showNew)}
                  className="p-2"
                  accessibilityLabel="Toggle new password visibility"
                >
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    className="text-on-surface-muted"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm New Password */}
            <View className="gap-1.5">
              <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider">
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-muted/40 rounded-xl px-3 border border-border/30">
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="Re-enter new password"
                  className="flex-1 border-0 bg-transparent shadow-none h-12"
                />
                <Pressable
                  onPress={() => setShowConfirm(!showConfirm)}
                  className="p-2"
                  accessibilityLabel="Toggle confirm password visibility"
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    className="text-on-surface-muted"
                  />
                </Pressable>
              </View>
            </View>

            {/* Password tip */}
            <View className="flex-row items-start gap-2 bg-muted/30 p-3.5 rounded-xl border border-border/20">
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                className="text-primary mt-0.5"
              />
              <Text className="text-on-surface-muted text-xs flex-1 leading-4">
                Use at least 8 characters with a mix of letters, numbers, and
                symbols to keep your account safe.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
