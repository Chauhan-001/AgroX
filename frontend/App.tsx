import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

/* ⭐ SCREENS IMPORT */
import SplashScreen from "./screens/SplashScreen";
import PhoneEntry from "./screens/PhoneEntry";
import HomeScreen from "./screens/Home/HomeScreen";
import OtpScreen from "./screens/otpScreen";

enableScreens();

/* ⭐ TYPE SAFE STACK */
export type RootStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  OTP: undefined;
  FarmerHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
        <Stack.Screen name="OTP" component={OtpScreen} />
        <Stack.Screen name="FarmerHome" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}