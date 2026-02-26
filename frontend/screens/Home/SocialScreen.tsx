import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function SocialScreen() {
  // 🔹 Extended government news
  const newsData = [
    {
      id: 1,
      title: "🌾 New Crop Insurance Scheme 2025",
      desc: "Government launched new insurance benefits for farmers to protect crops from natural disasters.",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    },
    {
      id: 2,
      title: "💰 Subsidy on Fertilizers Increased",
      desc: "Farmers will get higher subsidy on DAP and Urea to reduce cultivation cost.",
      image:
        "https://images.unsplash.com/photo-1589927986089-35812388d1f4",
    },
    {
      id: 3,
      title: "🚜 Farm Equipment Support",
      desc: "Up to 50% subsidy on modern agricultural machinery and tools.",
      image:
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
    },
    {
      id: 4,
      title: "🌱 Organic Farming Promotion",
      desc: "Government encourages organic farming with financial assistance.",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    },
    {
      id: 5,
      title: "💧 Irrigation Scheme Expansion",
      desc: "New irrigation projects approved to improve water availability for farms.",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    },
  ];

  return (
    <ScrollView
      style={styles.feed}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {newsData.map((item) => (
        <View key={item.id} style={styles.newsCard}>
          {/* 🖼 Scheme Image */}
          <Image source={{ uri: item.image }} style={styles.newsImage} />

          <View style={styles.textWrap}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: "#fff",
  },

  /* 🔥 Wider Premium Card */
  newsCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
  },

  /* 🖼 Image */
  newsImage: {
    width: "100%",
    height: 160,
  },

  textWrap: {
    padding: 14,
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    color: "#222",
  },

  newsDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});