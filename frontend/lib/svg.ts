import { cssInterop } from "nativewind";
import Svg, { Path } from "react-native-svg";

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

export { Svg, Path };
