import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabBar from "../components/BottomTabBar";

type RootStackParamList = {
  cropPredictionScreen: undefined;
  soilPrediction: undefined;
};

const HEADER_HEIGHT = 140;

export default function PredictionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7A00" />

      {/* ⭐ HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>AgroX Prediction</Text>
      </View>

      {/* ⭐ CONTENT */}
      <View
        style={[
          styles.container,
          {
            paddingTop: HEADER_HEIGHT + insets.top + 10,
            paddingBottom: 120 + insets.bottom,
          },
        ]}
      >
        <Text style={styles.title}>🌾 Prediction Tools</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("cropPredictionScreen")}
        >
          <Text style={styles.cardText}>🌱 Crop Recommendation Tool</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("soilPrediction")}
        >
          <Text style={styles.cardText}>🧪 Soil Prediction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>📊 Crop Yield AI</Text>
        </TouchableOpacity>
      </View>

      {/* ⭐ FOOTER (FIXED LIKE SUBSIDY SCREEN) */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <BottomTabBar activeTab="Prediction" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "#FF7A00",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    elevation: 10,
    zIndex: 10,
    justifyContent: "flex-end",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
    elevation: 3,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 25,
  },
});