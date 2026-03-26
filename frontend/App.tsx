import React, { JSX } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

enableScreens();

/* ⭐ SCREENS IMPORT */
import SplashScreen from "./screens/SplashScreen";
import PhoneEntry from "./screens/PhoneEntry";
import HomeScreen from "./screens/Home/HomeScreen";
import OtpScreen from "./screens/otpScreen";
import AdminLogin from "./screens/AdminLogin";
import AdminHome from "./screens/Admin/AdminHome";

/* ⭐ ADMIN */
import AdminNewsScreen from "./screens/Admin/AdminNewsScreen";
import AdminSubsidyScreen from "./screens/Admin/AdminSubsidyScreen";
import AdminMarketScreen from "./screens/Admin/AdminMarketScreen";
import FarmerMarketDetails from "./screens/Admin/FarmerMarketDetails";

/* ⭐ MODEL */
import cropsDetails from "./screens/cropRecommendationModelScreen/cropsDetails";
import cropPredictionScreen from "./screens/cropRecommendationModelScreen/cropPredictionScreen";
import selectCrop from "./screens/cropRecommendationModelScreen/selectCrop";
import PredictionScreen from "./screens/Prediction/PredictionScreen";

import SoilPrediction from "./screens/soil_type_prediction/index";
import resultsoil from "./screens/soil_type_prediction/result";

/* ⭐ PROFILE */
import ProfileScreen from "./screens/Profile/ProfileScreen";
import EditProfileScreen from "./screens/Profile/EditProfileScreen";
import ProfileViewScreen from "./screens/ProfileView/ProfileViewScreen";

/* ⭐ SOCIAL / MARKET */
import SocialScreen from "./screens/SocialScreen";
import BottomTabBar from "./screens/components/BottomTabBar";
import MarketScreen from "./screens/Market/MarketScreen";
import SubsidyScreen from "./screens/Subsidy/SubsidyScreen";
import FertilizersScreen from "./screens/Market/FertilizersScreen";
import SeedsScreen from "./screens/Market/SeedsScreen";
import ToolsScreen from "./screens/Market/ToolsScreen"; // ✅ ADDED

/* ⭐ TYPES */
export type RootStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  OTP: undefined;
  FarmerHome: undefined;
  AdminLogin: undefined;
  AdminHome: undefined;

  AdminNews: undefined;
  AdminSubsidy: undefined;
  AdminMarket: undefined;
  FarmerMarketDetails: undefined;

  cropsDetails: undefined;
  cropPredictionScreen: undefined;
  selectCrop: undefined;

  PredictionScreen: undefined;

  soilPrediction: undefined;
  resultSoil: undefined;

  Profile: undefined;
  EditProfile: { user: any };
  ProfileView: { user: any; posts: any[] };

  SocialScreen: undefined;
  BottomTabBar: undefined;

  MarketScreen: undefined;
  SubsidyScreen: undefined;

  FertilizersScreen: undefined;
  SeedsScreen: undefined;
  ToolsScreen: undefined; // ✅ ADDED
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
        {/* ⭐ AUTH */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
        <Stack.Screen name="OTP" component={OtpScreen} />
        <Stack.Screen name="FarmerHome" component={HomeScreen} />

        {/* ⭐ ADMIN */}
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="AdminNews" component={AdminNewsScreen} />
        <Stack.Screen name="AdminSubsidy" component={AdminSubsidyScreen} />
        <Stack.Screen name="AdminMarket" component={AdminMarketScreen} />
        <Stack.Screen name="FarmerMarketDetails" component={FarmerMarketDetails} />

        {/* ⭐ MODEL */}
        <Stack.Screen name="cropsDetails" component={cropsDetails} />
        <Stack.Screen name="cropPredictionScreen" component={cropPredictionScreen} />
        <Stack.Screen name="selectCrop" component={selectCrop} />
        <Stack.Screen name="PredictionScreen" component={PredictionScreen} />
        <Stack.Screen name="soilPrediction" component={SoilPrediction} />
        <Stack.Screen name="resultSoil" component={resultsoil} />

        {/* ⭐ PROFILE */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileView" component={ProfileViewScreen} />

        {/* ⭐ SOCIAL / MARKET */}
        <Stack.Screen name="SocialScreen" component={SocialScreen} />
        <Stack.Screen name="BottomTabBar" component={BottomTabBar} />
        <Stack.Screen name="MarketScreen" component={MarketScreen} />
        <Stack.Screen name="SubsidyScreen" component={SubsidyScreen} />

        {/* ⭐ MARKET SCREENS */}
        <Stack.Screen name="FertilizersScreen" component={FertilizersScreen} />
        <Stack.Screen name="SeedsScreen" component={SeedsScreen} />
        <Stack.Screen name="ToolsScreen" component={ToolsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}