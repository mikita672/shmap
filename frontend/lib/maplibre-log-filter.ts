import { LogManager } from "@maplibre/maplibre-react-native";

LogManager.onLog(({ message, tag }) => {
  if (
    tag === "Mbgl-LocationComponent" &&
    message.includes("Failed to obtain last location update")
  ) {
    return true;
  }
  if (
    tag === "Mbgl-MapSnapshotter" &&
    message.includes("Could not generate attribution")
  ) {
    return true;
  }
  return false;
});
