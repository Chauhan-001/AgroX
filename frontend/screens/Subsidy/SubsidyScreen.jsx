import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SubsidyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏛 Government Subsidy</Text>

      <View style={styles.card}>
        <Text>PM Kisan Yojana</Text>
      </View>

      <View style={styles.card}>
        <Text>Seed Subsidy</Text>
      </View>

      <View style={styles.card}>
        <Text>Equipment Subsidy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: {
    height: 90,
    backgroundColor: "#FFF3E0",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },
});