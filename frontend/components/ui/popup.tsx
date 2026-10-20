import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { cn } from "@/lib/utils";

const CARD_LAYOUT = LinearTransition.duration(200);

export interface PopupProps {
  visible: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export function Popup({ visible, onClose, className, children }: PopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-black/60"
          onPress={onClose}
          accessible={false}
          importantForAccessibility="no"
        />

        <Animated.View
          accessibilityViewIsModal
          layout={CARD_LAYOUT}
          className={cn(
            "w-full max-w-[344px] overflow-hidden rounded-[32px] bg-card",
            className,
          )}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
