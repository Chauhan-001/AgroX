import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

import SplashScreen from "./screens/SplashScreen";
import PhoneEntry from "./screens/PhoneEntry";
import HomeScreen from "./screens/Home/HomeScreen";
import otpScreen from "./screens/otpScreen";



enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
        <Stack.Screen name="FarmerHome" component={HomeScreen} />
        <Stack.Screen name="OTP" component={otpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}