import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import BottomTabBar from "../components/BottomTabBar";

type RootStackParamList = {
  cropPredictionScreen: undefined;
  soilPrediction: undefined;
};

export default function PredictionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>

      {/* ⭐ HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgroX Prediction</Text>
      </View>

      {/* ⭐ CONTENT */}
      <View style={styles.container}>
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

      {/* ⭐ SAME FOOTER */}
      <BottomTabBar activeTab="Prediction" onChange={()=>{}} />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 120,
    backgroundColor: "#FF7A00",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 8,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    height: 80,
    backgroundColor: "#F4F6FA",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
});