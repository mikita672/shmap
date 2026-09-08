import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTabColors } from "@/hooks/useTabColors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function PillIcon({
  name,
  size,
  focused,
  tintColor,
  activeIconColor,
  pillColor,
}: {
  name: IconName;
  size: number;
  focused: boolean;
  tintColor: string;
  activeIconColor: string;
  pillColor: string;
}) {
  return (
    <View
      style={{
        backgroundColor: focused ? pillColor : "transparent",
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* When focused: Russet icon. When unfocused: Lemon Meringue icon. */}
      <Ionicons
        name={name}
        size={size}
        color={focused ? activeIconColor : tintColor}
      />
    </View>
  );
}

export default function TabsLayout() {
  const colors = useTabColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.label,
        tabBarInactiveTintColor: colors.label,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
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
          tabBarIcon: ({ size, focused }) => (
            <PillIcon
              name="map-outline"
              size={size}
              focused={focused}
              tintColor={colors.icon}
              activeIconColor={colors.iconActive}
              pillColor={colors.bubble}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ size, focused }) => (
            <PillIcon
              name="chatbubble-outline"
              size={size}
              focused={focused}
              tintColor={colors.icon}
              activeIconColor={colors.iconActive}
              pillColor={colors.bubble}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ size, focused }) => (
            <PillIcon
              name="people-outline"
              size={size}
              focused={focused}
              tintColor={colors.icon}
              activeIconColor={colors.iconActive}
              pillColor={colors.bubble}
            />
          ),
        }}
      />
    </Tabs>
  );
}
