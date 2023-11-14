import { useColorScheme } from "react-native";
import colors from "../colors";

export function useTheme() {
  const isDark = useColorScheme() === "dark";

  const theme = {
    background: isDark ? colors.charcoal : colors.white,
    activeTint: isDark ? colors.hotPink : colors.deepBlue,
    inactiveTint: isDark ? colors.lightGray : colors.darkGray,
    header: isDark ? colors.charcoal : colors.white,
    headerTitle: isDark ? colors.hotPink : colors.deepBlue,
  };

  return isDark, theme;
}
