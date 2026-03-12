import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.pravatar.cc/150" }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Farmer Name</Text>
      <Text style={styles.info}>📍 Uttar Pradesh</Text>

      <View style={styles.card}>
        <Text>My Crops</Text>
      </View>

      <View style={styles.card}>
        <Text>Saved Predictions</Text>
      </View>

      <View style={styles.card}>
        <Text>Settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700" },
  info: { color: "#666", marginBottom: 20 },

  card: {
    width: "100%",
    height: 70,
    backgroundColor: "#F1F8E9",
    borderRadius: 16,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 10,
  },
});