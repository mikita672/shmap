import { ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@/lib/icons";

export interface LayersButtonProps {
  on: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function LayersButton({
  on,
  loading = false,
  onPress,
}: LayersButtonProps) {
  const filled = on && !loading;

  return (
    <Pressable
      onPress={onPress}
      className={`${filled ? "bg-tab-icon-active" : "bg-tab-bubble"} active:opacity-70 w-11 h-11 rounded-full items-center justify-center shadow-sm shadow-black/10 elevation-3`}
      accessibilityLabel="Friends' routes"
      accessibilityRole="switch"
      accessibilityState={{ checked: on, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#783D19" />
      ) : (
        <Ionicons
          name={on ? "layers" : "layers-outline"}
          size={24}
          className={on ? "text-tab-bubble" : "text-tab-icon-active"}
        />
      )}
    </Pressable>
  );
}
