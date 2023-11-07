import react from "react";
import { View, Text } from "react-native";
import { useTheme } from "../hooks/useTheme";

const News = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    ></View>
  );
};

export default News;
