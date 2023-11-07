import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";

SplashScreen.preventAutoHideAsync();

export default function App() {
  //* State ----------------------------------------------------------------------------
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded] = useFonts(FontAwesome5.font);
  //* Functions ------------------------------------------------------------------------
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  //* lifecycle --------------------------------------------------------------------------
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (loaded) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [loaded, appIsReady]);

  //* render ---------------------------------------------------------------------------
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </View>
  );
}
