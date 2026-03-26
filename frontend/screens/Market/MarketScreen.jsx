import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabBar from "../components/BottomTabBar";

const HEADER_HEIGHT = 150;

export default function MarketScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  // ✅ Added screen mapping
  const data = [
   
  { name: "🌿 Fertilizers", screen: "FertilizersScreen" },
  { name: "🌱 Seeds", screen: "SeedsScreen" },
  { name: "🚜 Farming Tools", screen: "ToolsScreen" },
];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7A00" />

      {/* ⭐ HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>AgroX Market</Text>

        {/* 🔍 SEARCH BAR */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* ⭐ CONTENT */}
      <View
        style={[
          styles.content,
          {
            paddingTop: HEADER_HEIGHT + insets.top + 10,
            paddingBottom: 120 + insets.bottom,
          },
        ]}
      >
        <Text style={styles.title}>🛒 Market Place</Text>

        {filteredData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⭐ FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <BottomTabBar activeTab="Marketplace" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "#FF7A00",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    elevation: 10,
    zIndex: 10,
    justifyContent: "flex-end",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: "center",
  },

  searchInput: {
    fontSize: 14,
    color: "#333",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 18,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 12,
    elevation: 3,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 25,
  },
});