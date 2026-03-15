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

export default function CreatePostScreen({ onClose, onPost }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");

  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (res.didCancel) return;

    const uri = res.assets?.[0]?.uri;
    if (uri) setImage(uri);
  };

  const handlePost = () => {
    if (!image) {
      Alert.alert("Select Image", "Please select crop image");
      return;
    }

    const newPost = {
      id: Date.now(),
      image,
      caption,
      crop,
      location,
      user: {
        name: "Farmer",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      likes: 0,
      comments: [],
      time: "Just now",
    };

    onPost(newPost);
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Post</Text>

        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.post}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.pickText}>Tap to select crop image</Text>
          )}
        </TouchableOpacity>

        {/* CROP */}
        <TextInput
          placeholder="Crop Name (e.g Wheat)"
          value={crop}
          onChangeText={setCrop}
          style={styles.input}
        />

        {/* LOCATION */}
        <TextInput
          placeholder="Farm Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        {/* CAPTION */}
        <TextInput
          placeholder="Write crop condition, disease, growth etc..."
          value={caption}
          onChangeText={setCaption}
          multiline
          style={styles.caption}
        />
      </ScrollView>
    </View>
  );
}

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
    height: 260,
    backgroundColor: "#f2f2f2",
    margin: 15,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  pickText: { color: "#777", fontSize: 15 },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  input: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
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
  },
});