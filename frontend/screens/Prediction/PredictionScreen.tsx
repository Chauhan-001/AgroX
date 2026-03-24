import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  cropPredictionScreen: undefined;
};

export default function PredictionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌾 Prediction Tools</Text>

      {/* Crop Recommendation */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("cropPredictionScreen")}
      >
        <Text style={styles.cardText}>🌱 Crop Recommendation Tool</Text>
      </TouchableOpacity>

      {/* Weather */}
      <TouchableOpacity style={styles.card}
       onPress={() => navigation.navigate("soilPrediction")}
       >
        <Text style={styles.cardText}>Soil prediction</Text>
      </TouchableOpacity>

      {/* Yield */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>📊 Crop Yield AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },

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