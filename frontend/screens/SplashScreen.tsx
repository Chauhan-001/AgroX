import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const leafAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🚀 Logo entrance
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("PhoneEntry");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FF7A00", "#FFB347"]}
      style={styles.container}
    >

      {/* AgroX Logo */}
      <Animated.Text
        style={[
          styles.brandText,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }, { translateY }],
          },
        ]}
      >
        AgroX
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[styles.tagline, { opacity: opacityAnim }]}
      >
        SMART FARMING · BETTER FUTURE
      </Animated.Text>

      {/* Bottom Icons */}
      <Text style={styles.bottomIconText}>🧑‍🌾 🌿 🚜</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  leaf: {
    position: "absolute",
    top: 120,
    fontSize: 26,
  },
  iconText: {
    fontSize: 30,
    marginBottom: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  brandText: {
    fontSize: 74,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#fff",
  },
  bottomIconText: {
    fontSize: 28,
    marginTop: 32,
    color: "#fff",
  },
});