import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Geolocation from "react-native-geolocation-service";

/* Screens & Components */
import SocialScreen from "../SocialScreen";
import ProfileViewScreen from "../ProfileView/ProfileViewScreen";
import PredictionScreen from "../Prediction/PredictionScreen";
import SubsidyScreen from "../Subsidy/SubsidyScreen";
import MarketScreen from "../Market/MarketScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import CreatePostScreen from "./CreatePostScreen";
import BottomTabBar from "../components/BottomTabBar";
import FloatingUploadButton from "../components/FloatingUploadButton";

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 95;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Social");
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  // 🔥 Change this to true to test the "Post" screen
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [weather, setWeather] = useState({
    temp: "--",
    city: "Fetching...",
    condition: "Clear",
  });

  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. All Hooks at the Top Level
  useEffect(() => {
    setIsHeaderVisible(true); 
    scrollY.setValue(0);
    getLocation();
  }, [activeTab, profileUser]);

  /* ================= HELPERS ================= */
  const getWeatherEmoji = (condition) => {
    const status = (condition || "").toLowerCase();
    if (status.includes("cloud")) return "☁️";
    if (status.includes("rain")) return "🌧️";
    if (status.includes("clear") || status.includes("sun")) return "☀️";
    if (status.includes("thunder")) return "⛈️";
    if (status.includes("mist") || status.includes("haze")) return "🌫️";
    return "🌤️";
  };

  const getLocation = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }
    Geolocation.getCurrentPosition(
      (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
      (err) => console.log(err),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = "8f09f4cd46d1803684bd373fa7b8ed8e"; 
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        city: data.name,
        condition: data.weather[0].main,
      });
    } catch (err) { console.log(err); }
  };

  const handleFloatingButtonPress = () => {
    if (onboardingComplete) {
      setCreatePostOpen(true);
    } else {
      // Logic for Placeholder Form (Shows if onboarding is false)
      Alert.alert(
        "Complete Onboarding",
        "Please fill in your details before you can post to the community.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Fill Form", onPress: () => setActiveTab("Profile") }
        ]
      );
    }
  };

  // 2. Calculated Constants
  const shouldShowHeader = activeTab === "Social" && !profileUser && isHeaderVisible;
  const currentHeaderHeight = shouldShowHeader ? HEADER_MAX_HEIGHT : 0;

  const headerAnimatedHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        
        {/* ================= MODALS ================= */}
        {createPostOpen && (
          <CreatePostScreen
            onClose={() => setCreatePostOpen(false)}
            onPost={(post) => {
              setPosts((prev) => [post, ...prev]);
              setCreatePostOpen(false);
            }}
          />
        )}

        {/* ================= HEADER ================= */}
        {shouldShowHeader && (
          <Animated.View style={[styles.header, { height: headerAnimatedHeight }]}>
            <LinearGradient colors={["#FF7A00", "#FFB347"]} style={styles.headerGradient}>
              <View style={styles.topRow}>
                <Text style={styles.brandText}>Agrox</Text>
                <TouchableOpacity onPress={() => setIsHeaderVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weatherContent}>
                <Text style={styles.title}>Today Weather</Text>
                <View style={styles.tempRow}>
                   <Text style={styles.temp}>{weather.temp}°C</Text>
                   <Text style={styles.weatherEmoji}>{getWeatherEmoji(weather.condition)}</Text>
                </View>
                <Text style={styles.desc}>
                  📍 {weather.city} • {weather.condition}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* ================= MAIN CONTENT AREA ================= */}
        <View style={{ flex: 1 }}>
          {/* Social Tab (Separate to handle specific scroll logic) */}
          {activeTab === "Social" && !profileUser && (
            <SocialScreen
              posts={posts}
              scrollY={scrollY}
              headerHeight={currentHeaderHeight}
              onOpenProfile={(user) => setProfileUser(user)}
            />
          )}

          {/* Other Tabs & Profile View */}
          {(activeTab !== "Social" || profileUser) && (
            <Animated.ScrollView
              contentContainerStyle={{
                paddingTop: shouldShowHeader ? HEADER_MAX_HEIGHT : 20,
                paddingBottom: 120,
              }}
            >
              {profileUser ? (
                <ProfileViewScreen user={profileUser} onBack={() => setProfileUser(null)} />
              ) : (
                <>
                  {activeTab === "Prediction" && <PredictionScreen />}
                  {activeTab === "Subsidy" && <SubsidyScreen />}
                  {activeTab === "Market" && <MarketScreen />}
                  {activeTab === "Profile" && <ProfileScreen />}
                </>
              )}
            </Animated.ScrollView>
          )}
        </View>

        {/* ================= FLOATING BUTTON ================= */}
        {/* Persists even if header is closed, only hidden in ProfileView */}
        {!profileUser && activeTab === "Social" && (
          <FloatingUploadButton onPress={handleFloatingButtonPress} />
        )}

        {/* ================= TAB BAR ================= */}
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
    top: 0, left: 0, right: 0,
    zIndex: 10,
    elevation: 10,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandText: { color: "#fff", fontSize: 24, fontWeight: "900", fontStyle: 'italic' },
  closeButton: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  closeIcon: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  weatherContent: { alignItems: "center", marginTop: -5 },
  tempRow: { flexDirection: 'row', alignItems: 'center' },
  title: { color: "#fff", fontWeight: "600", fontSize: 14, opacity: 0.9 },
  temp: { color: "#fff", fontSize: 42, fontWeight: "900" },
  weatherEmoji: { fontSize: 34, marginLeft: 10 },
  desc: { color: "#fff", fontSize: 13, fontWeight: "500" },
});