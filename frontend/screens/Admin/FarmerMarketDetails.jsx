import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function FarmerMarketDetails({ route }) {
  const { post } = route.params;

  // ✅ Support both single & multiple images
  const images = post.images && post.images.length > 0
    ? post.images
    : post.image
    ? [post.image]
    : [];

  return (
    <ScrollView style={styles.container}>

      {/* 🔥 IMAGE GALLERY */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: img }}
                style={styles.image}
                resizeMode="contain" // ✅ NO CROPPING
              />

              {/* 🔢 Index Badge */}
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>
                  {index + 1}/{images.length}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 📄 DETAILS CARD */}
      <View style={styles.card}>
        <Text style={styles.crop}>{post.crop}</Text>
        <Text style={styles.price}>₹ {post.price} / Quintal</Text>

        <Text style={styles.info}>🏢 {post.org}</Text>
        <Text style={styles.info}>📍 {post.location}</Text>
        <Text style={styles.info}>Required Qty: {post.qty}</Text>

        <Text style={styles.desc}>{post.desc}</Text>

        {/* 📞 CALL BUTTON */}
        {post.phone !== "" && (
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${post.phone}`)}
          >
            <Text style={styles.callText}>Call Buyer</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  /* 🔥 IMAGE SLIDER */
  imageSlider: {
    width: "100%",
    height: 280,
    backgroundColor: "#000",
  },

  imageWrapper: {
    width: width,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  indexBadge: {
    position: "absolute",
    bottom: 10,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  indexText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  /* 📄 CARD */
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 18,
    borderRadius: 18,
    elevation: 4,
  },

  crop: {
    fontSize: 22,
    fontWeight: "800",
  },

  price: {
    fontSize: 20,
    color: "#2E7D32",
    fontWeight: "800",
    marginVertical: 6,
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  desc: {
    marginTop: 10,
    color: "#666",
    lineHeight: 20,
  },

  callBtn: {
    backgroundColor: "#FF7A00",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },

  callText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});