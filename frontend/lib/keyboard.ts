import { cssInterop } from "nativewind";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

cssInterop(KeyboardAvoidingView, { className: "style" });

export { KeyboardAvoidingView };
