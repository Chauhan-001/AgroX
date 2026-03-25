import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function MarketScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>

      {/* ⭐ HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgroX Market</Text>
      </View>

      {/* ⭐ CONTENT */}
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Market Place</Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>🌿 Fertilizers</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>🌱 Seeds</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>🚜 Farming Tools</Text>
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

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("SubsidyScreen")}
        >
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.label}>Subsidy</Text>
        </TouchableOpacity>

        <View style={styles.tab}>
          <Text style={styles.iconActive}>🛒</Text>
          <Text style={styles.labelActive}>Marketplace</Text>
        </View>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.replace("Profile")}
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.label}>Profile</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
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
    height: 100,
    backgroundColor: "#E3F2FD",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  tab: {
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
    color: "#777",
  },

  iconActive: {
    fontSize: 22,
    color: "#FF7A00",
  },

  label: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  labelActive: {
    fontSize: 11,
    color: "#FF7A00",
    marginTop: 2,
    fontWeight: "700",
  },
});