import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BottomTabBar({ activeTab, onChange }: any) {

  const Tab = ({ label, icon, value }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => onChange(value)}>
      <Text style={[styles.icon, activeTab === value && styles.active]}>
        {icon}
      </Text>
      <Text style={[styles.label, activeTab === value && styles.active]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bar}>
      <Tab label="Social" icon="👥" value="Social" />
      <Tab label="Prediction Tools" icon="🧠" value="Prediction" />
      <Tab label="Subsidy" icon="💰" value="Subsidy" />
      <Tab label="Marketplace" icon="🛒" value="Market" />
      <Tab label="Profile" icon="👤" value="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  item: { alignItems: "center", flex: 1 },
  icon: { fontSize: 22, color: "#444" },
  label: { fontSize: 10, fontWeight: "600", color: "#444" },
  active: { color: "#FF7A00" },
});