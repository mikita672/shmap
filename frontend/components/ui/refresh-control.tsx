import {
  RefreshControl as RNRefreshControl,
  type ColorValue,
  type RefreshControlProps as RNRefreshControlProps,
} from "react-native";
import { cssInterop } from "nativewind";

export interface RefreshControlProps extends RNRefreshControlProps {
  spinnerColor?: ColorValue;
  className?: string;
}

export function RefreshControl({
  spinnerColor,
  ...props
}: RefreshControlProps) {
  return (
    <RNRefreshControl
      colors={spinnerColor ? [spinnerColor] : undefined}
      tintColor={spinnerColor}
      {...props}
    />
  );
}

cssInterop(RefreshControl, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: "spinnerColor",
      backgroundColor: "progressBackgroundColor",
    },
  },
});
