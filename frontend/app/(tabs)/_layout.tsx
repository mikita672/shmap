import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUnstableNativeVariable } from "nativewind";

export default function TabsLayout() {
  const backgroundRaw = useUnstableNativeVariable("--background");
  const borderRaw = useUnstableNativeVariable("--border");
  const primaryRaw = useUnstableNativeVariable("--primary");
  const mutedForegroundRaw = useUnstableNativeVariable("--muted-foreground");

  const background = backgroundRaw ? `hsl(${backgroundRaw})` : undefined;
  const border = borderRaw ? `hsl(${borderRaw})` : undefined;
  const primary = primaryRaw ? `hsl(${primaryRaw})` : undefined;
  const mutedForeground = mutedForegroundRaw
    ? `hsl(${mutedForegroundRaw})`
    : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: mutedForeground,
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
