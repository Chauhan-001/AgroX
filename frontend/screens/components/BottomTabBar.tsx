import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomTabBar({ activeTab }: any) {
  const navigation = useNavigation();

  const Tab = ({ label, icon, value, screen }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(screen)}
    >
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
      <Tab label="Social" icon="👥" value="Social" screen="FarmerHome" />

      <Tab
        label="Prediction Tools"
        icon="🧠"
        value="Prediction"
        screen="PredictionScreen"
      />

      <Tab
        label="Subsidy"
        icon="💰"
        value="Subsidy"
        screen="SubsidyScreen"
      />

      <Tab
        label="Marketplace"
        icon="🛒"
        value="Market"
        screen="MarketScreen"
      />

      <Tab
        label="Profile"
        icon="👤"
        value="Profile"
        screen="Profile"
      />
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