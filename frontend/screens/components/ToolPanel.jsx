import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ToolPanel() {
  const Tool = ({ icon, label }) => (
    <TouchableOpacity style={styles.tool}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Tool icon="🌾" label="Crop" />
      <Tool icon="🦠" label="Diseases" />
      <Tool icon="🧪" label="Fertilizer" />
      <Tool icon="🛠" label="Tools" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: "#fff7ef",
  },
  tool: { alignItems: "center" },
  icon: { fontSize: 24 },
  label: { fontSize: 12, fontWeight: "600", marginTop: 4 },
});