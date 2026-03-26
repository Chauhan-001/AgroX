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

export default function FertilizersScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const fertilizers = [
    {
      name: "Urea Fertilizer",
      price: "₹266 / bag",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2024/2/383719659/QW/FK/BP/200162855/solar-pannel-500x500.jpeg",
      link: "https://dir.indiamart.com/impcat/urea.html",
    },
    {
      name: "DAP Fertilizer",
      price: "₹1350 / bag",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/0c/DAP_fertilizer.jpg",
      link: "https://dir.indiamart.com/impcat/dap-fertilizer.html",
    },
    {
      name: "NPK Fertilizer",
      price: "₹1200 / bag",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/2/2d/NPK_fertilizer.jpg",
      link: "https://dir.indiamart.com/impcat/npk-fertilizer.html",
    },
    {
      name: "Potash (MOP)",
      price: "₹1700 / bag",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Potash_fertilizer.jpg",
      link: "https://dir.indiamart.com/impcat/potash-fertilizer.html",
    },
    {
      name: "Organic Compost",
      price: "₹300 / bag",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/55/Compost.jpg",
      link: "https://dir.indiamart.com/impcat/organic-compost.html",
    },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      alert("Unable to open link")
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7A00" />

      {/* ⭐ HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>🌿 Fertilizers</Text>
      </View>

      {/* ⭐ CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + 10,
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
      >
        {fertilizers.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openLink(item.link)}
          >
            {/* ✅ FIXED IMAGE */}
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />

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

  // ✅ IMAGE FIXED HERE
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
    color: "#FF7A00",
    fontWeight: "600",
  },
});