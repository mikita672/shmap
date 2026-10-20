import { Switch as RNSwitch } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const RUSSET = "hsl(22.74, 65.52%, 28.43%)";
const CAMEL = "hsl(30, 34%, 58%)";
const CORNSILK = "hsl(52, 93%, 93%)";
const LEMON_MERINGUE = "hsl(43, 81%, 88%)";
const LAUREL_GREEN = "hsl(74, 22%, 62%)";
const DARK_OLIVE_GREEN = "hsl(93.1, 15.03%, 37.84%)";

const SWITCH_COLORS = {
  light: {
    trackOn: CAMEL,
    trackOff: LAUREL_GREEN,
    thumbOn: RUSSET,
    thumbOff: CORNSILK,
  },
  dark: {
    trackOn: CAMEL,
    trackOff: DARK_OLIVE_GREEN,
    thumbOn: LEMON_MERINGUE,
    thumbOff: CAMEL,
  },
};

export interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  const { isDark } = useTheme();
  const colors = SWITCH_COLORS[isDark ? "dark" : "light"];

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: colors.trackOff, true: colors.trackOn }}
      thumbColor={value ? colors.thumbOn : colors.thumbOff}
      ios_backgroundColor={colors.trackOff}
    />
  );
}
