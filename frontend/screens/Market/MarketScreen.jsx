import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Market Place</Text>

      <View style={styles.card}>
        <Text>Fertilizers</Text>
      </View>

      <View style={styles.card}>
        <Text>Seeds</Text>
      </View>

      <View style={styles.card}>
        <Text>Farming Tools</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: {
    height: 100,
    backgroundColor: "#E3F2FD",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },
});