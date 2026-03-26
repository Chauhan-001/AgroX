import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabBar from "../components/BottomTabBar";

const HEADER_HEIGHT = 160;

export default function SubsidyScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const subsidyData = useMemo(
    () => [
      {
        title: "PM Kisan Samman Nidhi",
        amount: "₹6000 / year",
        detail:
          "Central government provides income support to all eligible farmer families in three equal installments.",
        link: "https://pmkisan.gov.in/",
      },
      {
        title: "Seed Subsidy Scheme",
        amount: "Up to 50% subsidy",
        detail:
          "Farmers get high quality certified seeds at subsidized price to improve agricultural productivity.",
        link: "https://agricoop.nic.in/",
      },
      {
        title: "Farm Machinery Subsidy",
        amount: "40% – 80%",
        detail:
          "Government provides subsidy on tractor, rotavator, power tiller, drip irrigation and other equipment.",
        link: "https://agrimachinery.nic.in/",
      },
      {
        title: "Soil Health Card Scheme",
        amount: "Free soil testing",
        detail:
          "Provides soil nutrient status and fertilizer recommendation for better crop yield.",
        link: "https://soilhealth.dac.gov.in/",
      },
      {
        title: "PM Fasal Bima Yojana",
        amount: "Low premium insurance",
        detail:
          "Crop insurance scheme protecting farmers from natural disasters, pests and diseases.",
        link: "https://pmfby.gov.in/",
      },
    ],
    []
  );

  const filteredData = subsidyData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      alert("Unable to open link")
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f57c00" />

      {/* ⭐ HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Government Subsidy</Text>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search subsidy scheme..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* ⭐ CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + 10,
          paddingBottom: 120 + insets.bottom,
          paddingHorizontal: 16,
        }}
      >
        {filteredData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openLink(item.link)}
          >
            <Text style={styles.schemeTitle}>{item.title}</Text>
            <Text style={styles.schemeAmount}>{item.amount}</Text>
            <Text style={styles.schemeDetail}>{item.detail}</Text>

            {/* 🔗 LINK TEXT */}
            <Text style={styles.linkText}>View Details →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ⭐ FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <BottomTabBar activeTab="Subsidy" />
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
    backgroundColor: "#f57c00",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 18,
    paddingBottom: 18,
    elevation: 12,
    zIndex: 10,
    justifyContent: "flex-end",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
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

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
  },

  schemeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  schemeAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
    marginTop: 4,
  },

  schemeDetail: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    lineHeight: 18,
  },

  linkText: {
    marginTop: 10,
    color: "#f57c00",
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