import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SubsidyScreen() {

  const navigation = useNavigation();

  return (
    <View style={styles.screen}>

      {/* ⭐ CONTENT */}
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

      {/* ⭐ FOOTER */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("FarmerHome")}
        >
          <Text style={styles.icon}>👥</Text>
          <Text style={styles.label}>Social</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("PredictionScreen")}
        >
          <Text style={styles.icon}>🧠</Text>
          <Text style={styles.label}>Prediction</Text>
        </TouchableOpacity>

        <View style={styles.tab}>
          <Text style={styles.iconActive}>💰</Text>
          <Text style={styles.labelActive}>Subsidy</Text>
        </View>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("MarketScreen")}
        >
          <Text style={styles.icon}>🛒</Text>
          <Text style={styles.label}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("Profile")}
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.label}>Profile</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  container: { flex: 1, padding: 20 },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },

  card: {
    height: 90,
    backgroundColor: "#FFF3E0",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  tab: { alignItems: "center" },

  icon: { fontSize: 22, color: "#777" },

  iconActive: { fontSize: 22, color: "#FF7A00" },

  label: { fontSize: 11, color: "#777", marginTop: 2 },

  labelActive: {
    fontSize: 11,
    color: "#FF7A00",
    marginTop: 2,
    fontWeight: "700",
  },
});