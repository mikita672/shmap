import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { parseLocalDate, toLocalDateString } from "@/lib/local-date";
import { formatDateRowValue } from "@/lib/route-format";

export interface DateRowProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export function DateRow({ value, onChange, disabled }: DateRowProps) {
  const [now] = useState(() => Date.now());
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  const handleChange = (_event: unknown, date: Date) => {
    onChange(toLocalDateString(date));
  };

  const handlePress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: parseLocalDate(value),
        mode: "date",
        maximumDate: new Date(),
        onValueChange: handleChange,
      });
    } else {
      setIosPickerOpen((open) => !open);
    }
  };

  return (
    <View className="gap-2">
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Date, ${formatDateRowValue(value, now)}`}
        className="h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-5 active:opacity-80"
      >
        <View className="h-12 w-12 items-center justify-center rounded-full bg-avatar-surface">
          <MaterialIcons
            name="event"
            size={24}
            className="text-avatar-surface-foreground"
          />
        </View>

        <View className="flex-1">
          <Text className="text-sm leading-5 text-secondary">Date</Text>
          <Text
            numberOfLines={1}
            className="text-base leading-6 text-action-foreground"
          >
            {formatDateRowValue(value, now)}
          </Text>
        </View>

        <Text className="text-sm font-medium leading-5 text-action-foreground">
          Change
        </Text>
      </Pressable>

      {Platform.OS === "ios" && iosPickerOpen && (
        <DateTimePicker
          value={parseLocalDate(value)}
          mode="date"
          display="inline"
          maximumDate={new Date(now)}
          onValueChange={handleChange}
        />
      )}
    </View>
  );
}
