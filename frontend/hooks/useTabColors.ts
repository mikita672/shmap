import { useColorScheme } from "react-native";

/**
 * Tab bar colors that mirror the CSS variables defined in global.css.
 * The tab bar uses React Navigation's tabBarStyle (plain JS objects),
 * which cannot use NativeWind classNames or CSS variables directly.
 * Keep these values in sync with global.css if the theme changes.
 */
const TAB_COLORS = {
  light: {
    background: "hsl(74, 22%, 62%)", // --background: Laurel Green #A9B388
    border: "hsl(74, 22%, 45%)", // --border
    icon: "hsl(43, 81%, 88%)", // --tab-icon: Lemon Meringue #F9EBC7
    iconActive: "hsl(22.74, 65.52%, 28.43%)", // --tab-icon-active: Russet #783D19
    bubble: "hsl(43, 81%, 88%)", // --tab-bubble: Lemon Meringue #F9EBC7
    label: "hsl(43, 81%, 88%)", // Lemon Meringue for all labels
  },
  dark: {
    background: "hsl(93, 15%, 38%)", // --background: Dark Olive Green
    border: "hsl(93, 15%, 50%)", // --border
    icon: "hsl(52, 93%, 93%)", // --tab-icon: Cornsilk
    iconActive: "hsl(22.74, 65.52%, 28.43%)", // --tab-icon-active: Russet #783D19
    bubble: "hsl(30, 34%, 58%)", // --tab-bubble: Camel
    label: "hsl(52, 93%, 93%)", // Cornsilk for all labels
  },
};

export function useTabColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? TAB_COLORS.dark : TAB_COLORS.light;
}
