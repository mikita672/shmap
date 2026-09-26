import { cssInterop } from "nativewind";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

export { MaterialIcons, Ionicons };
