import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="gap-2">
      <Text className="px-5 text-sm text-secondary">{title}</Text>
      {children}
    </View>
  );
}
