import React, { JSX } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

/* ⭐ SCREENS IMPORT */
import SplashScreen from "./screens/SplashScreen";
import PhoneEntry from "./screens/PhoneEntry";
import HomeScreen from "./screens/Home/HomeScreen";
import OtpScreen from "./screens/otpScreen";
import AdminLogin from "./screens/AdminLogin";
import AdminHome from "./screens/Admin/AdminHome";


/* ⭐ NEW ADMIN POST SCREENS */
import AdminNewsScreen from "./screens/Admin/AdminNewsScreen";
import AdminSubsidyScreen from "./screens/Admin/AdminSubsidyScreen";
import AdminMarketScreen from "./screens/Admin/AdminMarketScreen";
import FarmerMarketDetails from "./screens/Admin/FarmerMarketDetails";

enableScreens();

/* ⭐ TYPE SAFE STACK */
export type RootStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  OTP: undefined;
  FarmerHome: undefined;
  AdminLogin: undefined;
  AdminHome: undefined;
  AdminPostForm: undefined;

  /* ⭐ ADD THESE */
  AdminNews: undefined;
  AdminSubsidy: undefined;
  AdminMarket: undefined;
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
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
       

        {/* ⭐ NEW ADDED SCREENS */}
        <Stack.Screen name="AdminNews" component={AdminNewsScreen} />
        <Stack.Screen name="AdminSubsidy" component={AdminSubsidyScreen} />
        <Stack.Screen name="AdminMarket" component={AdminMarketScreen} />
        <Stack.Screen name="FarmerMarketDetails" component={FarmerMarketDetails} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}