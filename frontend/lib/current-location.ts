import { LocationManager } from "@maplibre/maplibre-react-native";
import { enqueuePermissionRequest } from "@/lib/permission-queue";

export async function getCurrentLocation() {
  try {
    const granted = await enqueuePermissionRequest(() =>
      LocationManager.requestPermissions(),
    );
    if (!granted) return null;
    const position = await LocationManager.getCurrentPosition();
    if (!position) return null;
    const { latitude, longitude } = position.coords;
    return { latitude, longitude };
  } catch {
    return null;
  }
}
