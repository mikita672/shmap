import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedTabBar } from "@/components/animated-tab-bar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
