import react from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Coins from "../screens/Coins";
import Prices from "../screens/Prices";
import News from "../screens/News";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

const Tab = createBottomTabNavigator();

function Tabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Coins"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        tabBarActiveTintColor: theme.activeTint,
        tabBarInactiveTintColor: theme.inactiveTint,
        headerStyle: {
          backgroundColor: theme.header,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: theme.headerTitle,
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Coins"
        component={Coins}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name="coins" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Prices"
        component={Prices}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <FontAwesome5 name="dollar-sign" color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name="newspaper" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs;
