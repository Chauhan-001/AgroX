import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ✅ MATCH YOUR BACKEND */
const API_URL = "http://192.168.25.228:7000/api/farmer/create";

export default function CreatePostScreen({ onClose, onPost }) {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE PICK ================= */
  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
      selectionLimit: 0,
    });

    if (res.didCancel) return;

    const newImgs = res.assets || [];

    if (images.length + newImgs.length > 5) {
      Alert.alert("Limit Reached", "Max 5 images allowed");
      return;
    }

    setImages([...images, ...newImgs]);
  };

  /* ================= FORM DATA ================= */
  const createFormData = () => {
    const formData = new FormData();

    formData.append("caption", caption);
    formData.append("crop", crop);
    formData.append("location", location);

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        name: img.fileName || `image_${index}.jpg`,
        type: img.type || "image/jpeg",
      });
    });

    return formData;
  };

  /* ================= POST ================= */
  const handlePost = async () => {
    if (loading) return;

    if (images.length === 0) {
      Alert.alert("Select Image", "Please select crop image");
      return;
    }

    if (!crop.trim()) {
      Alert.alert("Crop Required", "Please enter crop name");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("FarmerToken");
      console.log("Using token:", token); // ✅ DEBUG 

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ MUST MATCH verifyToken
        },
        body: createFormData(), // ✅ multipart form
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed");

      Alert.alert("Success", "Post created");

      /* ✅ OPTIONAL: instant UI update */
      const newPost = {
        id: data._id || Date.now().toString(),
        images: images.map((i) => i.uri),
        crop,
        location,
        caption,
        user: {
          name: "Farmer",
          avatar: "https://i.pravatar.cc/100",
        },
        likes: 0,
        comments: [],
      };

      onPost && onPost(newPost);
      onClose && onClose();
    } catch (err) {
      console.log("POST ERROR:", err);
      Alert.alert("Error", err.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Post</Text>

        <TouchableOpacity onPress={handlePost} disabled={loading}>
          <Text style={styles.post}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {images.length > 0 ? (
            <>
              <Image
                source={{ uri: images[0].uri }}
                style={styles.mainImage}
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((img, index) => (
                  <View key={index} style={styles.thumbWrapper}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.indexBadge}>
                      <Text style={styles.indexText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={styles.pickText}>
              Tap to select crop images
            </Text>
          )}
        </TouchableOpacity>

        {/* CROP */}
        <TextInput
          placeholder="Crop Name (e.g Wheat)"
          placeholderTextColor="#999"
          value={crop}
          onChangeText={setCrop}
          style={styles.input}
        />

        {/* LOCATION */}
        <TextInput
          placeholder="Farm Location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        {/* CAPTION */}
        <TextInput
          placeholder="Write crop condition, disease, growth etc..."
          placeholderTextColor="#999"
          value={caption}
          onChangeText={setCaption}
          multiline
          style={styles.caption}
        />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 999,
    elevation: 20,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  cancel: { color: "#666", fontSize: 16 },
  post: { color: "#FF7A00", fontWeight: "700", fontSize: 16 },
  title: { fontSize: 18, fontWeight: "700" },

  imageBox: {
    backgroundColor: "#f2f2f2",
    margin: 15,
    borderRadius: 16,
    padding: 10,
  },

  pickText: {
    color: "#8d8686",
    fontSize: 15,
    textAlign: "center",
  },

  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 10,
  },

  thumbWrapper: {
    marginRight: 10,
  },

  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  indexBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#FF7A00",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  indexText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  input: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: "#000",
  },

  caption: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 40,
    color: "#000",
  },
});