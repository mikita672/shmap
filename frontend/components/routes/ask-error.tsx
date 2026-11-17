import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { extractApiError } from "@/lib/utils/error";

const NO_ANSWER_MESSAGE =
  "No answer from the server. Check your connection and try again.";

export function getAskErrorMessage(error: unknown) {
  const apiError = extractApiError(error);
  if (!apiError || apiError.code === "NETWORK_ERROR") return NO_ANSWER_MESSAGE;
  return apiError.message || "Couldn't get suggestions. Try again later";
}

export interface AskErrorProps {
  error: unknown;
}

export function AskError({ error }: AskErrorProps) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="flex-row items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5"
    >
      <MaterialIcons name="cloud-off" size={16} className="text-destructive" />
      <Text className="flex-1 text-[13px] leading-[18px] text-destructive dark:text-on-surface">
        {getAskErrorMessage(error)}
      </Text>
    </View>
  );
}
