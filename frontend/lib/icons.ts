import { cssInterop } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

export { MaterialIcons };
