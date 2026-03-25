import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../ipconfig";
const { width } = Dimensions.get("window");

const API_URL = `http://${url}:7000/api/admin/news`;
const BASE_URL = `http://${url}:7000`;

export default function AdminNewsScreen() {
  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [adType, setAdType] = useState("");
  const [images, setImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) fetchPosts();
  }, [isFocused]);

  /* ================= FETCH ================= */
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  /* ================= REFRESH ================= */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  /* ================= IMAGE PICK ================= */
  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit", "Max 4 images allowed");
      return;
    }

    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 0,
    });

    if (!res.didCancel) {
      const uris = res.assets?.map((i) => i.uri) || [];
      setImages([...images, ...uris].slice(0, 4));
    }
  };

  /* ================= LINK ================= */
  const openLink = async (url) => {
    if (!url) return;
    const full = url.startsWith("http") ? url : "https://" + url;
    Linking.openURL(full);
  };

  /* ================= FORM DATA ================= */
  const createFormData = () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("redirectLink", redirectLink);
    formData.append("adType", adType);

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri ? img.uri : img,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    return formData;
  };

  /* ================= SAVE ================= */
  const savePost = async () => {
    if (loading) return;

    if (!title.trim()) return Alert.alert("Enter title");
    if (!description.trim()) return Alert.alert("Enter description");

    setLoading(true);

    try {
      const formData = createFormData();
      const token = await AsyncStorage.getItem("AdminToken");

      let res;

      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Alert.alert("Success", editingId ? "Updated" : "Created");

      fetchPosts();
      resetForm();
    } catch (err) {
      Alert.alert("Error", err.message);
    }

    setLoading(false);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    if (loading) return;

    setTitle("");
    setDescription("");
    setRedirectLink("");
    setAdType("");
    setImages([]);
    setEditingId(null);
    setShowModal(false);
  };

  /* ================= EDIT ================= */
  const editPost = (item) => {
    setTitle(item.title || "");
    setDescription(item.description || "");
    setRedirectLink(item.redirectLink || "");
    setAdType(item.adType || "");

    const imgs =
      item.images?.map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}/${img}`
      ) || [];

    setImages(imgs);
    setEditingId(item._id);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const deletePost = (id) => {
    Alert.alert("Delete", "Delete this news?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const token = await AsyncStorage.getItem("AdminToken");

          await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchPosts();
        },
      },
    ]);
  };

  /* ================= UI ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* MULTIPLE IMAGES */}
      {item.images?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.images.map((img, i) => (
            <Image
              key={i}
              source={{
                uri: img.startsWith("http")
                  ? img
                  : `${BASE_URL}/${img}`,
              }}
              style={styles.multiImage}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#777" }}>No Image Available</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {!!item.adType && <Text style={styles.meta}>📢 {item.adType}</Text>}

        {!!item.redirectLink && (
          <TouchableOpacity onPress={() => openLink(item.redirectLink)}>
            <Text style={styles.link}>🌐 Read Full News</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => editPost(item)}>
          <Text style={styles.actionText}>EDIT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePost(item._id)}
        >
          <Text style={styles.actionText}>DEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF7A00" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📰 Agriculture News</Text>
        <Text style={styles.headerSub}>Manage farming updates</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(i) => i._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={resetForm} disabled={loading}>
              <Text style={{ color: "#999" }}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit News" : "Create News"}
            </Text>

            <TouchableOpacity onPress={savePost} disabled={loading}>
              <Text style={{ color: "#FF7A00", fontWeight: "700" }}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
              multiline
            />

            <TextInput
              placeholder="Redirect Link"
              placeholderTextColor="#888"
              value={redirectLink}
              onChangeText={setRedirectLink}
              style={styles.input}
            />

            <TextInput
              placeholder="Ad Type (product/service/awareness)"
              placeholderTextColor="#888"
              value={adType}
              onChangeText={setAdType}
              style={styles.input}
            />

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              {images.length > 0 ? (
                <ScrollView horizontal>
                  {images.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img.uri ? img.uri : img }}
                      style={styles.thumb}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={{ color: "#555" }}>
                  Select Images (Max 4)
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },

  header: {
    backgroundColor: "#FF7A00",
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  headerSub: { color: "#FFE7D1", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },

  multiImage: {
    width: width * 0.7,
    height: width * 0.55,
    marginRight: 10,
  },

  placeholder: {
    height: width * 0.55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  content: { padding: 14 },

  titleText: { fontSize: 16, fontWeight: "700" },
  desc: { color: "#555", marginTop: 4 },

  meta: { fontSize: 12, color: "#777", marginTop: 3 },

  link: { color: "#1976D2", marginTop: 6, fontWeight: "700" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },

  editBtn: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },

  deleteBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  actionText: { color: "#fff", fontSize: 12 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#FF7A00",
    justifyContent: "center",
    alignItems: "center",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  modalTitle: { fontSize: 18, fontWeight: "700" },

  input: {
    backgroundColor: "#F1F3F7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  textArea: {
    backgroundColor: "#F1F3F7",
    padding: 14,
    borderRadius: 12,
    height: 120,
    marginBottom: 10,
  },

  imageBox: {
    height: 120,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  thumb: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 12,
  },
});