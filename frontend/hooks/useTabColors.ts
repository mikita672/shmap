import { useTheme } from "@/hooks/useTheme";

/**
 * Tab bar colors as plain values. The tab bar paints with StyleSheet and
 * passes color strings to tabBarIcon, so it can't use NativeWind classNames.
 * "default" mirrors the CSS variables in global.css; "contrast" is the
 * Friends tab bar from Figma. Keep both in sync with the design.
 */
const TAB_COLORS = {
  light: {
    default: {
      background: "hsl(74, 22%, 62%)", // --background: Laurel Green #A9B388
      border: "hsl(74, 22%, 45%)", // --border
      icon: "hsl(43, 81%, 88%)", // --tab-icon: Lemon Meringue #F9EBC7
      iconActive: "hsl(22.74, 65.52%, 28.43%)", // --tab-icon-active: Russet #783D19
      bubble: "hsl(43, 81%, 88%)", // --tab-bubble: Lemon Meringue #F9EBC7
      label: "hsl(43, 81%, 88%)", // Lemon Meringue
      labelActive: "hsl(22.74, 65.52%, 28.43%)", // Russet
    },
    contrast: {
      background: "hsl(93.1, 15.03%, 37.84%)", // Dark Olive Green #5F6F52
      border: "hsl(93.1, 15.03%, 37.84%)", // same as the bar
      icon: "hsl(43, 81%, 88%)", // Lemon Meringue #F9EBC7
      iconActive: "hsl(22.74, 65.52%, 28.43%)", // Russet #783D19
      bubble: "hsl(43, 81%, 88%)", // Lemon Meringue #F9EBC7
      label: "hsl(43, 81%, 88%)", // Lemon Meringue
      labelActive: "hsl(43, 81%, 88%)", // Lemon Meringue
    },
  },
  dark: {
    default: {
      background: "hsl(93, 15%, 38%)", // --background: Dark Olive Green
      border: "hsl(93, 15%, 50%)", // --border
      icon: "hsl(52, 93%, 93%)", // --tab-icon: Cornsilk
      iconActive: "hsl(22.74, 65.52%, 28.43%)", // --tab-icon-active: Russet #783D19
      bubble: "hsl(30, 34%, 58%)", // --tab-bubble: Camel
      label: "hsl(52, 93%, 93%)", // Cornsilk
      labelActive: "hsl(22.74, 65.52%, 28.43%)", // Russet
    },
    contrast: {
      background: "hsl(22.74, 65.52%, 28.43%)", // Russet #783D19
      border: "hsl(22.74, 65.52%, 28.43%)", // same as the bar
      icon: "hsl(30, 34%, 58%)", // Camel #B99470
      iconActive: "hsl(22.74, 65.52%, 28.43%)", // Russet #783D19
      bubble: "hsl(30, 34%, 58%)", // Camel #B99470
      label: "hsl(30, 34%, 58%)", // Camel
      labelActive: "hsl(30, 34%, 58%)", // Camel
    },
  },
};

export type TabBarTone = keyof typeof TAB_COLORS.light;

export function useTabColors(tone: TabBarTone = "default") {
  const { isDark } = useTheme();
  return TAB_COLORS[isDark ? "dark" : "light"][tone];
}
