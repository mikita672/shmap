import { cssInterop } from "nativewind";
import QRCode from "react-native-qrcode-svg";

declare module "react-native-qrcode-svg" {
  interface QRCodeProps {
    className?: string;
  }
}

cssInterop(QRCode, {
  className: {
    target: false,
    nativeStyleToProp: { color: true },
  },
});

export { QRCode };
