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
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

/* ⭐ SESSION MEMORY STORE */
let NEWS_SESSION = [];

export default function AdminNewsScreen() {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setPosts([...NEWS_SESSION]);
    }
  }, [isFocused]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res && res.assets && res.assets.length > 0) {
        setImage(res.assets[0].uri);
      }
    });
  };

  const savePost = () => {

    if (!title.trim() || !desc.trim()) return;

    if (editingId) {
      NEWS_SESSION = NEWS_SESSION.map(p =>
        p.id === editingId
          ? { ...p, title, desc, image }
          : p
      );
    } else {
      const newPost = {
        id: Date.now().toString(),
        title,
        desc,
        image,
        date: new Date().toLocaleDateString(),
      };
      NEWS_SESSION = [newPost, ...NEWS_SESSION];
    }

    setPosts([...NEWS_SESSION]);

    setTitle("");
    setDesc("");
    setImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  const editPost = (item) => {
    setTitle(item.title);
    setDesc(item.desc);
    setImage(item.image);
    setEditingId(item.id);
    setShowModal(true);
  };

  const deletePost = (id) => {
    Alert.alert(
      "Delete News",
      "Are you sure you want to delete?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            NEWS_SESSION = NEWS_SESSION.filter(p => p.id !== id);
            setPosts([...NEWS_SESSION]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDesc}>{item.desc}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => editPost(item)}
        >
          <Text style={styles.actionText}>EDIT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePost(item.id)}
        >
          <Text style={styles.actionText}>DEL</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌾 Agriculture News</Text>
        <Text style={styles.headerSub}>
          Manage farming updates
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No news added
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>

          <Text style={styles.modalTitle}>
            {editingId ? "Edit News" : "Create News"}
          </Text>

          <TextInput
            placeholder="News Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
            style={styles.textArea}
          />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              />
            ) : (
              <Text>Select Image</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.publishBtn}
            onPress={savePost}
          >
            <Text style={styles.publishText}>
              {editingId ? "Update News" : "Publish News"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowModal(false)}
          >
            <Text style={{ color: "#555" }}>Close</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

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
    elevation: 4,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: width * 0.55,
  },

  content: { padding: 14 },

  postTitle: { fontSize: 16, fontWeight: "700" },
  postDesc: { fontSize: 13, color: "#555", marginTop: 3 },
  date: { fontSize: 11, color: "#999", marginTop: 6 },

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
    elevation: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },

  modalTitle: { fontSize: 22, fontWeight: "800", marginBottom: 15 },

  input: {
    backgroundColor: "#F1F3F7",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  textArea: {
    backgroundColor: "#F1F3F7",
    padding: 14,
    borderRadius: 14,
    height: 120,
    marginBottom: 12,
    textAlignVertical: "top",
  },

  imagePicker: {
    height: 160,
    backgroundColor: "#F1F3F7",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  publishBtn: {
    backgroundColor: "#FF7A00",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  publishText: { color: "#fff", fontWeight: "700" },

  closeBtn: {
    alignItems: "center",
    marginTop: 12,
  },

});