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
  Linking,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {url} from "../../ipconfig"
const { width } = Dimensions.get("window");

const API_URL = `http://${url}:7000/api/admin/subsidies`;
const BASE_URL = `http://${url}:7000`;

export default function AdminSubsidyScreen() {
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schemeType, setSchemeType] = useState("");
  const [stateName, setStateName] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data.subsidies || data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= REFRESH ================= */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  /* ================= IMAGE PICK ================= */
  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Max 4 images allowed");
      return;
    }

    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 0,
      quality: 0.7,
    });

    if (!res.didCancel) {
      const newImgs = res.assets || [];

      if (images.length + newImgs.length > 4) {
        Alert.alert("Only 4 images allowed");
        return;
      }

      setImages([...images, ...newImgs]);
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
    formData.append("schemeType", schemeType);
    formData.append("state", stateName);
    formData.append("lastDate", lastDate);
    formData.append("link", link);

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri || img,
        type: img.type || "image/jpeg",
        name: img.fileName || `image_${index}.jpg`,
      });
    });

    return formData;
  };

  /* ================= SAVE ================= */
  const savePost = async () => {
    if (!title || !description) {
      Alert.alert("Fill required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = createFormData();

      let res;

      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${await AsyncStorage.getItem("AdminToken")}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            authorization: `Bearer ${await AsyncStorage.getItem("AdminToken")}`,
          },
          body: formData,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchData();
      resetForm();
    } catch (err) {
      Alert.alert("Error", err.message);
    }

    setLoading(false);
  };

  /* ================= DELETE ================= */
  const deletePost = (id) => {
    Alert.alert("Delete", "Delete this subsidy?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${await AsyncStorage.getItem("AdminToken")}`,
            },
          });

          fetchData();
        },
      },
    ]);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    if (loading) return; // prevent close while saving

    setTitle("");
    setDescription("");
    setSchemeType("");
    setStateName("");
    setLastDate("");
    setLink("");
    setImages([]);
    setEditingId(null);
    setShowModal(false);
  };

  /* ================= EDIT ================= */
  const editPost = (item) => {
    setTitle(item.title || "");
    setDescription(item.description || "");
    setSchemeType(item.schemeType || "");
    setStateName(item.state || "");
    setLastDate(item.lastDate || "");
    setLink(item.link || "");

    const imgs =
      item.images?.map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}/${img}`
      ) || [];

    setImages(imgs);
    setEditingId(item._id);
    setShowModal(true);
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
        <Text style={styles.desc}>{item.description}</Text>

        {!!item.schemeType && <Text style={styles.meta}>🏷 {item.schemeType}</Text>}
        {!!item.state && <Text style={styles.meta}>📍 {item.state}</Text>}
        {!!item.lastDate && <Text style={styles.meta}>⏳ {item.lastDate}</Text>}

        {!!item.link && (
          <TouchableOpacity onPress={() => openLink(item.link)}>
            <Text style={styles.link}>🌐 Apply Now</Text>
          </TouchableOpacity>
        )}
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

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏛 Govt Subsidy</Text>
        <Text style={styles.headerSub}>Manage schemes</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
            <TouchableOpacity disabled={loading} onPress={resetForm}>
              <Text style={{ color: loading ? "#ccc" : "#000" }}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit" : "Create"}
            </Text>

            <TouchableOpacity disabled={loading} onPress={savePost}>
              {loading ? (
                <ActivityIndicator color="#FF7A00" />
              ) : (
                <Text style={{ color: "#FF7A00" }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <TextInput placeholder="Title" placeholderTextColor="#888" value={title} onChangeText={setTitle} style={styles.input}/>
            <TextInput placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} style={styles.textArea}/>
            <TextInput placeholder="Scheme Type" placeholderTextColor="#888" value={schemeType} onChangeText={setSchemeType} style={styles.input}/>
            <TextInput placeholder="State" placeholderTextColor="#888" value={stateName} onChangeText={setStateName} style={styles.input}/>
            <TextInput placeholder="Last Date" placeholderTextColor="#888" value={lastDate} onChangeText={setLastDate} style={styles.input}/>
            <TextInput placeholder="Link" placeholderTextColor="#888" value={link} onChangeText={setLink} style={styles.input}/>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {images.length > 0 ? (
                <ScrollView horizontal>
                  {images.map((img, i) => (
                    <Image key={i} source={{ uri: img.uri || img }} style={styles.thumb}/>
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

/* STYLES */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F4F6FA" },

  header:{
    backgroundColor:"#FF7A00",
    paddingTop:55,
    paddingBottom:25,
    paddingHorizontal:18,
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
  },

  headerTitle:{ fontSize:24, fontWeight:"800", color:"#fff" },
  headerSub:{ color:"#FFE7D1" },

  card:{ backgroundColor:"#fff", borderRadius:16, marginBottom:15 },

  image:{ width: width * 0.7, height:200, marginRight:10 },

  placeholder:{
    height:200,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#eee",
  },

  title:{ fontSize:16, fontWeight:"700" },
  desc:{ color:"#555" },
  meta:{ fontSize:12, color:"#777" },
  link:{ color:"#1976D2", marginTop:6 },

  row:{ flexDirection:"row", justifyContent:"space-between", padding:10 },
  edit:{ color:"blue" },
  delete:{ color:"red" },

  fab:{
    position:"absolute",
    bottom:30,
    right:20,
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:"#FF7A00",
    justifyContent:"center",
    alignItems:"center",
  },

  modalHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:15,
  },

  modalTitle:{ fontSize:18, fontWeight:"700" },

  input:{
    backgroundColor:"#F1F3F7",
    padding:14,
    borderRadius:10,
    marginBottom:10,
  },

  textArea:{
    backgroundColor:"#F1F3F7",
    padding:14,
    borderRadius:10,
    height:100,
    marginBottom:10,
  },

  imagePicker:{
    height:120,
    backgroundColor:"#eee",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10,
  },

  thumb:{ width:100, height:100, marginRight:10 },
});