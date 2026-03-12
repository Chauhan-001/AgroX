import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import SocialScreen from "../SocialScreen";
import PredictionScreen from "../Prediction/PredictionScreen";
import SubsidyScreen from "../Subsidy/SubsidyScreen";
import MarketScreen from "../Market/MarketScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import ProfileViewScreen from "../ProfileView/ProfileViewScreen";

import BottomTabBar from "../components/BottomTabBar";
import FloatingUploadButton from "../components/FloatingUploadButton";

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 95;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Social");
  const [posts, setPosts] = useState<any[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const renderContent = () => {

    /* ⭐ PROFILE SCREEN OPEN */
    if (profileUser) {
      return (
        <ProfileViewScreen
          user={profileUser}
          posts={posts}
          onBack={() => setProfileUser(null)}
        />
      );
    }

    switch (activeTab) {
      case "Social":
        return (
          <SocialScreen
            posts={posts}
            onOpenProfile={(user: any) => setProfileUser(user)}
          />
        );

      case "Prediction":
        return <PredictionScreen />;

      case "Subsidy":
        return <SubsidyScreen />;

      case "Market":
        return <MarketScreen />;

      case "Profile":
        return <ProfileScreen />;

      default:
        return (
          <SocialScreen
            posts={posts}
            onOpenProfile={(user: any) => setProfileUser(user)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>

        {/* ⭐ WEATHER HEADER */}
        {activeTab === "Social" && !profileUser && (
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <LinearGradient
              colors={["#FF7A00", "#FFB347"]}
              style={styles.headerGradient}
            >
              <Text style={styles.title}>Today Weather</Text>
              <Text style={styles.temp}>28°C</Text>
              <Text style={styles.desc}>📍 Moradabad • Sunny</Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.ScrollView
          contentContainerStyle={{
            paddingTop:
              activeTab === "Social" && !profileUser
                ? HEADER_MAX_HEIGHT
                : 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {renderContent()}
        </Animated.ScrollView>

        {/* ⭐ HIDE FAB + TAB IN PROFILE */}
        {!profileUser && (
          <>
            <FloatingUploadButton
              onPostCreate={(media: any) => {
                setPosts((prev) => [media, ...prev]);
                setActiveTab("Social");
              }}
            />

            <BottomTabBar
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    zIndex: 10,
    elevation: 6,
  },

  headerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    alignSelf: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  temp: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
  },

  desc: {
    color: "#fff",
  },
});