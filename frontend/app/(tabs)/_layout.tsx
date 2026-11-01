import { useEffect } from "react";
import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedTabBar } from "@/components/animated-tab-bar";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadChatCount } from "@/hooks/useUnreadChatCount";

export default function TabsLayout() {
  const { pendingLink, clearPendingLink } = useAuth();
  const { data: unreadCount = 0 } = useUnreadChatCount();

  useEffect(() => {
    if (!pendingLink) return;
    router.push(pendingLink, { withAnchor: true });
    clearPendingLink();
  }, [pendingLink, clearPendingLink]);

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
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
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarAccessibilityLabel:
            unreadCount > 0
              ? `Chats, ${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}`
              : "Chats",
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
