import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import SocialScreen from "../SocialScreen";
import PredictionScreen from "../Prediction/PredictionScreen";
import SubsidyScreen from "../Subsidy/SubsidyScreen";
import MarketScreen from "../Market/MarketScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import ProfileViewScreen from "../ProfileView/ProfileViewScreen";
import CreatePostScreen from "./CreatePostScreen";

import BottomTabBar from "../components/BottomTabBar";
import FloatingUploadButton from "../components/FloatingUploadButton";

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 95;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Social");
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollY.setValue(0);
  }, [activeTab, profileUser]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const renderTabsContent = () => {
    if (profileUser) {
      return (
        <ProfileViewScreen
          user={profileUser}
          posts={posts}
          onBack={() => setProfileUser(null)}
        />
      );
    }

if (activeTab === "Prediction")
  return <PredictionScreen navigation={navigation} />;    
if (activeTab === "Subsidy") return <SubsidyScreen  />;
    if (activeTab === "Market") return <MarketScreen />;
    if (activeTab === "Profile") return <ProfileScreen />;

    return null;
  };

  const showHeader = activeTab === "Social" && !profileUser;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        
        {/* ⭐ CREATE POST SCREEN */}
        {createPostOpen && (
          <CreatePostScreen
            onClose={() => setCreatePostOpen(false)}
            onPost={(post) => {
              setPosts(prev => [post, ...prev]);

              // ⭐ auto go to home feed
              setActiveTab("Social");
              setProfileUser(null);
              setCreatePostOpen(false);
            }}
          />
        )}

        {/* ⭐ HEADER */}
        {showHeader && (
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

        {/* ⭐ SOCIAL FEED */}
        {activeTab === "Social" && !profileUser && (
          <View style={{ flex: 1 }}>
            <SocialScreen
              posts={posts}
              scrollY={scrollY}
              headerHeight={HEADER_MAX_HEIGHT}
              onOpenProfile={(user) => setProfileUser(user)}
            />
          </View>
        )}

        {/* ⭐ OTHER TABS */}
        {activeTab !== "Social" && !profileUser && (
          <Animated.ScrollView
            contentContainerStyle={{
              paddingTop: showHeader ? HEADER_MAX_HEIGHT : 20,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={
              showHeader
                ? Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )
                : undefined
            }
          >
            {renderTabsContent()}
          </Animated.ScrollView>
        )}

        {/* ⭐ PROFILE VIEW */}
        {profileUser && renderTabsContent()}

        {/* ⭐ FLOAT BUTTON */}
        {showHeader && (
          <FloatingUploadButton onPress={() => setCreatePostOpen(true)} />
        )}

        {/* ⭐ TAB BAR */}
        {!profileUser && (
          <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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