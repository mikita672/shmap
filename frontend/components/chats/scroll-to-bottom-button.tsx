import { StyleSheet } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoundButton } from "@/components/ui/round-button";

const ENTERING = ZoomIn.duration(150);
const EXITING = ZoomOut.duration(150);

export interface ScrollToBottomButtonProps {
  visible: boolean;
  badge: number;
  onPress: () => void;
}

export function ScrollToBottomButton({
  visible,
  badge,
  onPress,
}: ScrollToBottomButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView
      offset={{ opened: insets.bottom }}
      style={styles.container}
    >
      {visible && (
        <Animated.View entering={ENTERING} exiting={EXITING}>
          <RoundButton
            icon="keyboard-arrow-down"
            size="md"
            accessibilityLabel="Scroll to the newest message"
            badge={badge}
            className="shadow-sm shadow-black/20 elevation-3"
            onPress={onPress}
          />
        </Animated.View>
      )}
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 12,
    bottom: 12,
  },
});
