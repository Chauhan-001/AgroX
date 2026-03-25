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

//Models screens
import cropsDetails from "./screens/cropRecommendationModelScreen/cropsDetails";
import cropPredictionScreen from "./screens/cropRecommendationModelScreen/cropPredictionScreen";
import selectCrop from "./screens/cropRecommendationModelScreen/selectCrop";
import PredictionScreen from "./screens/Prediction/PredictionScreen";

import SoilPrediction from "./screens/soil_type_prediction/index";
import resultsoil from "./screens/soil_type_prediction/result";

import ProfileScreen from "./screens/Profile/ProfileScreen";
import ProfileViewScreen from "./screens/ProfileView/ProfileViewScreen";

import SocialScreen from "./screens/SocialScreen";
import BottomTabBar from "./screens/components/BottomTabBar";
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
  FarmerMarketDetails: undefined;

  /* ⭐ MODEL SCREENS */
  cropsDetails: undefined;
  cropPredictionScreen: undefined;
  selectCrop: undefined;

  PredictionScreen: undefined;

  resultSoil: undefined;
  soilPrediction: undefined; 
  Profile: undefined;
  ProfileView: { user: any; posts: any[] };


  SocialScreen: undefined;
  BottomTabBar: undefined;
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


        {/* MODEL SCREENS */}
        <Stack.Screen name="cropsDetails" component={cropsDetails} />
        <Stack.Screen name="cropPredictionScreen" component={cropPredictionScreen} />
        <Stack.Screen name="selectCrop" component={selectCrop} />

        <Stack.Screen name="PredictionScreen" component={PredictionScreen} />

        <Stack.Screen name="soilPrediction" component={SoilPrediction} />
      <Stack.Screen name="resultSoil" component={resultsoil} />   

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileView" component={ProfileViewScreen} />

      <Stack.Screen name="SocialScreen" component={SocialScreen} />
      <Stack.Screen name="BottomTabBar" component={BottomTabBar} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}