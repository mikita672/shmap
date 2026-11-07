import { Linking } from "react-native";
import { toast } from "sonner-native";
import AppChooser from "@/modules/app-chooser/src/AppChooserModule";
import { getGoogleMapsDirectionsUrl } from "@/lib/map-link";
import type { RouteResponse } from "@/lib/types/api";

export async function openRouteInMaps(route: RouteResponse) {
  const url = getGoogleMapsDirectionsUrl(route.stops, route.travelMode);
  if (!url) return;

  try {
    if (AppChooser) {
      await AppChooser.openWithChooser(url, "Open route with");
    } else {
      await Linking.openURL(url);
    }
  } catch {
    toast.error("Couldn't open map apps");
  }
}
