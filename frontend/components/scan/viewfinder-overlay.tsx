import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Path, Svg } from "@/lib/svg";

const WINDOW_SIZE = 260;
const WINDOW_RADIUS = 28;
const WINDOW_OFFSET_Y = -40;
const FRAME_WIDTH = 4;
const HINT_GAP = 28;

function roundedSquarePath(x: number, y: number, size: number, r: number) {
  return [
    `M${x + r} ${y}`,
    `H${x + size - r}`,
    `A${r} ${r} 0 0 1 ${x + size} ${y + r}`,
    `V${y + size - r}`,
    `A${r} ${r} 0 0 1 ${x + size - r} ${y + size}`,
    `H${x + r}`,
    `A${r} ${r} 0 0 1 ${x} ${y + size - r}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join("");
}

export function ViewfinderOverlay() {
  const { width, height } = useWindowDimensions();
  const left = (width - WINDOW_SIZE) / 2;
  const top = (height - WINDOW_SIZE) / 2 + WINDOW_OFFSET_Y;
  const maskPath = `M0 0H${width}V${height}H0Z${roundedSquarePath(left, top, WINDOW_SIZE, WINDOW_RADIUS)}`;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      <Svg width={width} height={height}>
        <Path d={maskPath} fill="black" fillOpacity={0.55} fillRule="evenodd" />
      </Svg>
      <View
        className="absolute rounded-[32px] border-4 border-qr-tile"
        style={{
          left: left - FRAME_WIDTH,
          top: top - FRAME_WIDTH,
          width: WINDOW_SIZE + FRAME_WIDTH * 2,
          height: WINDOW_SIZE + FRAME_WIDTH * 2,
        }}
      />
      <Text
        className="absolute inset-x-6 text-center leading-6 tracking-[0.5px] text-foreground"
        style={{ top: top + WINDOW_SIZE + HINT_GAP }}
      >
        Point at a Shmap QR code
      </Text>
    </View>
  );
}
