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
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

let NEWS_SESSION = [];

export default function AdminNewsScreen() {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isFocused) setPosts([...NEWS_SESSION]);
  }, [isFocused]);

  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });

    if (!res.didCancel && res.assets?.length > 0) {
      setImage(res.assets[0].uri);
    }
  };

  const openLink = async (url) => {
    if (!url) return;

    let full = url.startsWith("http") ? url : "https://" + url;

    const supported = await Linking.canOpenURL(full);

    if (supported) Linking.openURL(full);
    else Alert.alert("Invalid link");
  };

  const savePost = () => {

    if (!title.trim()) return Alert.alert("Enter title");
    if (!description.trim()) return Alert.alert("Enter description");

    if (editingId !== null) {
      NEWS_SESSION = NEWS_SESSION.map(p =>
        p.id === editingId
          ? { ...p, title, description, image, redirectLink }
          : p
      );
    } else {
      NEWS_SESSION.unshift({
        id: Date.now().toString(),
        title,
        description,
        image,
        redirectLink,
        date: new Date().toLocaleDateString(),
      });
    }

    setPosts([...NEWS_SESSION]);

    setTitle("");
    setDescription("");
    setRedirectLink("");
    setImage("");
    setEditingId(null);
    setShowModal(false);
  };

  const editPost = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setRedirectLink(item.redirectLink);
    setImage(item.image);
    setEditingId(item.id);
    setShowModal(true);
  };

  const deletePost = (id) => {
    Alert.alert("Delete", "Delete this news?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          NEWS_SESSION = NEWS_SESSION.filter(p => p.id !== id);
          setPosts([...NEWS_SESSION]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}

      <View style={styles.content}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {item.redirectLink ? (
          <TouchableOpacity onPress={() => openLink(item.redirectLink)}>
            <Text style={styles.link}>🌐 Open Full News</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.date}>{item.date}</Text>
      </View>

      {/* ⭐ ACTION COMPONENT */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => editPost(item)}>
          <Text style={styles.actionText}>EDIT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePost(item.id)}>
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
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 60 }}>
            No news added
          </Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 18 }}>←</Text>
            </TouchableOpacity>
            <Text style={styles.formTitle}>
              {editingId ? "Edit News" : "Create News"}
            </Text>
          </View>

          <View style={{ padding: 20 }}>

            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.textArea}
            />

            <TextInput
              placeholder="Redirect Link"
              value={redirectLink}
              onChangeText={setRedirectLink}
              style={styles.input}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              ) : (
                <Text>Select Image</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.publish} onPress={savePost}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                SAVE NEWS
              </Text>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#F4F6FA" },

  header: {
    backgroundColor: "#FF7A00",
    paddingTop: 55,
    paddingBottom: 28,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  headerSub: {
    color: "#FFE7D1",
    marginTop: 4,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 15,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  image: {
    width: "100%",
    height: width * 0.55,
  },

  content: { padding: 12 },

  titleText: { fontSize: 16, fontWeight: "700" },
  desc: { fontSize: 13, color: "#555", marginTop: 3 },

  link: {
    fontSize: 14,
    color: "#1976D2",
    marginTop: 6,
    fontWeight: "700",
  },

  date: { fontSize: 11, color: "#999", marginTop: 5 },

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
    textAlignVertical: "top",
  },

  imagePicker: {
    height: 160,
    backgroundColor: "#F1F3F7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  publish: {
    backgroundColor: "#FF7A00",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

});