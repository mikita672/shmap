import AsyncStorage from "@react-native-async-storage/async-storage";

const FRIENDS_ROUTES_KEY = "@shmap:map-layers/friends-routes";

export async function getFriendsRoutesLayer(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(FRIENDS_ROUTES_KEY)) === "on";
  } catch {
    return false;
  }
}

export async function setFriendsRoutesLayer(on: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(FRIENDS_ROUTES_KEY, on ? "on" : "off");
  } catch {}
}
