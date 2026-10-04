import { cssInterop } from "nativewind";
import { Image } from "expo-image";

cssInterop(Image, { className: "style" });

export { Image };
export type { ImageProps } from "expo-image";
