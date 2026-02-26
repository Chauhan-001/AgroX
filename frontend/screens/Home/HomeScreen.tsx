import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import SocialScreen from "./SocialScreen";

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 95;
const HEADER_SCROLL_DISTANCE =
  HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Social");
  const [showTools, setShowTools] = useState(false);

  // 🔁 change to: sunny | cloud | rain
  const weatherType = "sunny";

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  /* ================= HEADER ANIMATIONS ================= */

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const tempTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  const tempScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.82],
    extrapolate: "clamp",
  });

  // ✅ icon shrink to avoid cutting
  const iconScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.65],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  /* ================= WEATHER ICON ================= */

  const getWeatherIcon = () => {
    switch (weatherType) {
      case "cloud":
        return "☁️";
      case "rain":
        return "🌧️";
      default:
        return "☀️";
    }
  };

  /* ================= TAB LOGIC ================= */

  const handleTab = (tab) => {
    setActiveTab(tab);
    if (tab === "Prediction Tools") {
      setShowTools((prev) => !prev);
    } else {
      setShowTools(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "Social") {
      return <SocialScreen navigation={navigation} />;
    }
    return <View style={{ height: 320 }} />;
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={{ flex: 1 }}>
        {/* 🔥 PREMIUM HEADER */}
        <Animated.View
          style={[
            styles.headerContainer,
            { height: headerHeight },
          ]}
        >
          <LinearGradient
            colors={["#FF7A00", "#FFB347"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            {/* title */}
            <Animated.Text
              style={[styles.weatherTitle, { opacity: titleOpacity }]}
            >
              Today Weather
            </Animated.Text>

            {/* main row */}
            <Animated.View
              style={[
                styles.mainRow,
                {
                  transform: [
                    { translateX: tempTranslateX },
                    { scale: tempScale },
                  ],
                },
              ]}
            >
              {/* LEFT SIDE */}
              <View>
                <Text style={styles.weatherTemp}>28°C</Text>
                <Text style={styles.weatherDesc}>
                  📍 Moradabad • Sunny
                </Text>
              </View>

              {/* RIGHT ICON (animated) */}
              <Animated.Text
                style={[
                  styles.weatherIcon,
                  { transform: [{ scale: iconScale }] },
                ]}
              >
                {getWeatherIcon()}
              </Animated.Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* 🔥 SCROLL AREA */}
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {showTools && (
            <View style={styles.toolsPanel}>
              <ToolItem label="Crop" icon="🌾" />
              <ToolItem label="Diseases" icon="🦠" />
              <ToolItem label="Fertilizer" icon="🧪" />
              <ToolItem label="Tools" icon="🛠" />
            </View>
          )}

          {renderContent()}
        </Animated.ScrollView>

        {/* 🔻 BOTTOM BAR */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <NavItem
            label="Social"
            icon="👥"
            active={activeTab === "Social"}
            onPress={() => handleTab("Social")}
          />
          <NavItem
            label="Prediction Tools"
            icon="🧠"
            active={activeTab === "Prediction Tools"}
            onPress={() => handleTab("Prediction Tools")}
          />
          <NavItem
            label="Subsidy Product"
            icon="💰"
            active={activeTab === "Subsidy"}
            onPress={() => handleTab("Subsidy")}
          />
          <NavItem
            label="Marketplace"
            icon="🛒"
            active={activeTab === "Marketplace"}
            onPress={() => handleTab("Marketplace")}
          />
          <NavItem
            label="Profile"
            icon="👤"
            active={activeTab === "Profile"}
            onPress={() => handleTab("Profile")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= SMALL COMPONENTS ================= */

const NavItem = ({ label, icon, onPress, active }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Text style={[styles.navIcon, active && { color: "#FF7A00" }]}>
      {icon}
    </Text>
    <Text style={[styles.navLabel, active && { color: "#FF7A00" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ToolItem = ({ label, icon }) => (
  <TouchableOpacity style={styles.toolItem}>
    <Text style={styles.toolIcon}>{icon}</Text>
    <Text style={styles.toolLabel}>{label}</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },

  /* 🔥 softer modern header */
  header: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  weatherTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 6,
  },

  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weatherTemp: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
  },

  weatherDesc: {
    color: "#fff",
    fontSize: 13,
    marginTop: 2,
    opacity: 0.95,
  },

  weatherIcon: {
    fontSize: 52, // ✅ bigger premium icon
  },

  toolsPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: "#fff7ef",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 22, color: "#444" },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
    color: "#444",
    fontWeight: "600",
  },

  toolItem: { alignItems: "center" },
  toolIcon: { fontSize: 24 },
  toolLabel: { fontSize: 12, fontWeight: "600", marginTop: 4 },
});