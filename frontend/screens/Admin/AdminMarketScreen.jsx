import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";
import {url} from "../../ipconfig"
const { width } = Dimensions.get("window");

const API_URL = `http://${url}:7000/api/admin/posts`;
const BASE_URL = `http://${url}:7000`;

export default function AdminMarketScreen() {
  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [images, setImages] = useState([]);

  /* ================= FETCH ================= */
  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("AdminToken");

      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchPosts();
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  /* ================= IMAGE PICK ================= */
  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Max 4 images allowed");
      return;
    }

    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 4,
    });

    if (!res.didCancel) {
      setImages(res.assets || []);
    }
  };

  /* ================= SAVE ================= */
  const savePost = async () => {
    if (loading) return;

    if (!title || !product || !price) {
      Alert.alert("Fill required fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("product", product);
    formData.append("company", company);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("contactInfo", contactInfo);

    images.forEach((img, i) => {
      formData.append("images", {
        uri: img.uri || img,
        type: img.type || "image/jpeg",
        name: img.fileName || `image_${i}.jpg`,
      });
    });

    try {
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

      fetchPosts();
      resetForm();
    } catch (err) {
      Alert.alert("Error", err.message);
    }

    setLoading(false);
  };

  /* ================= DELETE ================= */
  const deletePost = (id) => {
    Alert.alert("Delete", "Delete this product?", [
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

  /* ================= EDIT ================= */
  const editPost = (item) => {
    setTitle(item.title || "");
    setProduct(item.product || "");
    setCompany(item.company || "");
    setDescription(item.description || "");
    setPrice(item.price || "");
    setContactInfo(item.contactInfo || "");

    setImages(item.images || []);
    setEditingId(item._id);

    setShowModal(true);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    if (loading) return;

    setTitle("");
    setProduct("");
    setCompany("");
    setDescription("");
    setPrice("");
    setContactInfo("");
    setImages([]);
    setEditingId(null);
    setShowModal(false);
  };

  /* ================= UI ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.images?.length > 0 ? (
        <ScrollView horizontal>
          {item.images.map((img, i) => (
            <Image
              key={i}
              source={{
                uri: img.startsWith("http")
                  ? img
                  : `${BASE_URL}/${img}`,
              }}
              style={styles.image}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#777" }}>No Image Available</Text>
        </View>
      )}

      <View style={{ padding: 14 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.product}>{item.product}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.contact}>📞 {item.contactInfo}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => editPost(item)}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deletePost(item._id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF7A00" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Agri Market</Text>
        <Text style={styles.headerSub}>Manage marketplace products</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={resetForm} disabled={loading}>
              <Text style={{ color: loading ? "#aaa" : "#000" }}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit Product" : "Create Product"}
            </Text>

            <TouchableOpacity onPress={savePost} disabled={loading}>
              <Text style={{ color: "#FF7A00" }}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <TextInput placeholder="Title" placeholderTextColor="#888" value={title} onChangeText={setTitle} style={styles.input}/>
            <TextInput placeholder="Product" placeholderTextColor="#888" value={product} onChangeText={setProduct} style={styles.input}/>
            <TextInput placeholder="Company" placeholderTextColor="#888" value={company} onChangeText={setCompany} style={styles.input}/>
            <TextInput placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} style={styles.textArea}/>
            <TextInput placeholder="Price" placeholderTextColor="#888" value={price} onChangeText={setPrice} style={styles.input}/>
            <TextInput placeholder="Contact Info" placeholderTextColor="#888" value={contactInfo} onChangeText={setContactInfo} style={styles.input}/>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {images.length > 0 ? (
                <ScrollView horizontal>
                  {images.map((img, i) => (
                    <Image
                      key={i}
                      source={{
                        uri: img.uri ? img.uri : `${BASE_URL}/${img}`,
                      }}
                      style={styles.thumb}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={{ color: "#555" }}>Select Images (Max 4)</Text>
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

  image: { width: width * 0.7, height: 200, marginRight: 10 },

  placeholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  title: { fontSize: 16, fontWeight: "700" },
  product: { color: "#666" },
  company: { color: "#444" },
  desc: { color: "#555", marginTop: 4 },
  price: { color: "#2E7D32", fontWeight: "700" },
  contact: { color: "#000", marginTop: 4 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  edit: { color: "blue" },
  delete: { color: "red" },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
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
    borderRadius: 10,
    marginBottom: 10,
  },

  textArea: {
    backgroundColor: "#F1F3F7",
    padding: 14,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
  },

  imagePicker: {
    height: 120,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  thumb: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});