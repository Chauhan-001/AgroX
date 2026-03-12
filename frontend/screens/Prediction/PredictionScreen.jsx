import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PredictionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌾 Prediction Tools</Text>

      <View style={styles.card}>
        <Text>Disease Prediction</Text>
      </View>

      <View style={styles.card}>
        <Text>Weather Based Suggestion</Text>
      </View>

      <View style={styles.card}>
        <Text>Crop Yield AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: {
    height: 80,
    backgroundColor: "#F4F6FA",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },
});