import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 140;

export default function ToolsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // ✅ Farming tools data
  const tools = [
    {
      name: "Tractor",
      price: "₹5,00,000",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3c/Tractor.jpg",
      link: "https://dir.indiamart.com/impcat/tractor.html",
    },
    {
      name: "Plough",
      price: "₹15,000",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/5d/Plough.jpg",
      link: "https://dir.indiamart.com/impcat/plough.html",
    },
    {
      name: "Seed Drill Machine",
      price: "₹25,000",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/0f/Seed_drill.jpg",
      link: "https://dir.indiamart.com/impcat/seed-drill.html",
    },
    {
      name: "Sprayer Pump",
      price: "₹3,000",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/9/9e/Sprayer.jpg",
      link: "https://dir.indiamart.com/impcat/agriculture-sprayer.html",
    },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      alert("Unable to open link")
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#795548" />

      {/* ⭐ HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        
        {/* 🔙 BACK BUTTON */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>🚜 Farming Tools</Text>
      </View>

      {/* ⭐ CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + 10,
          paddingBottom: 30,
          paddingHorizontal: 20,
        }}
      >
        {tools.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openLink(item.link)}
          >
            {/* IMAGE */}
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />

            {/* INFO */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.link}>View Product →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    height: HEADER_HEIGHT,
    backgroundColor: "#FF7A00",
    left: 0,
    right: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    justifyContent: "flex-end",
    elevation: 10,
    zIndex: 10,
  },

  back: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 140,
    backgroundColor: "#f9f9f9",
  },

  info: {
    padding: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  price: {
    fontSize: 14,
    color: "#2e7d32",
    marginTop: 5,
  },

  link: {
    marginTop: 8,
    color: "#795548",
    fontWeight: "600",
  },
});