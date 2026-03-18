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
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

let SUBSIDY_SESSION = [];

const STATES = [
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Rajasthan",
  "Gujarat",
  "Punjab",
  "Haryana",
  "Bihar",
  "Maharashtra",
  "Chhattisgarh",
  "Jharkhand",
  "Odisha",
  "West Bengal",
];

export default function AdminSubsidyScreen() {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schemeType, setSchemeType] = useState("");
  const [stateName, setStateName] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);

  useEffect(() => {
    if (isFocused) setPosts([...SUBSIDY_SESSION]);
  }, [isFocused]);

  const pickImage = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
      if (!res.didCancel && res.assets?.length > 0) {
        setImage(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Image error");
    }
  };

  const openLink = async (url) => {
    if (!url) return;
    let full = url.startsWith("http") ? url : "https://" + url;
    Linking.openURL(full);
  };

  const savePost = () => {

    if (!title.trim() || !description.trim()) {
      Alert.alert("Title & Description required");
      return;
    }

    if (editingId !== null) {
      SUBSIDY_SESSION = SUBSIDY_SESSION.map(p =>
        p.id === editingId
          ? { ...p, title, description, schemeType, stateName, lastDate, link, image }
          : p
      );
    } else {
      SUBSIDY_SESSION.unshift({
        id: Date.now().toString(),
        title,
        description,
        schemeType,
        stateName,
        lastDate,
        link,
        image,
      });
    }

    setPosts([...SUBSIDY_SESSION]);

    setTitle("");
    setDescription("");
    setSchemeType("");
    setStateName("");
    setLastDate("");
    setLink("");
    setImage("");
    setEditingId(null);
    setShowModal(false);
  };

  const editPost = (item) => {
    setTitle(item.title || "");
    setDescription(item.description || "");
    setSchemeType(item.schemeType || "");
    setStateName(item.stateName || "");
    setLastDate(item.lastDate || "");
    setLink(item.link || "");
    setImage(item.image || "");
    setEditingId(item.id);
    setShowModal(true);
  };

  const deletePost = (id) => {
    Alert.alert("Delete Subsidy", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          SUBSIDY_SESSION = SUBSIDY_SESSION.filter(p => p.id !== id);
          setPosts([...SUBSIDY_SESSION]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {!!item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      <View style={{ padding: 14 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {!!item.schemeType && <Text style={styles.meta}>🏷 {item.schemeType}</Text>}
        {!!item.stateName && <Text style={styles.meta}>📍 {item.stateName}</Text>}
        {!!item.lastDate && <Text style={styles.meta}>⏳ {item.lastDate}</Text>}

        {!!item.link && (
          <TouchableOpacity onPress={() => openLink(item.link)}>
            <Text style={styles.link}>🌐 Apply Now</Text>
          </TouchableOpacity>
        )}
      </View>

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
        <Text style={styles.headerTitle}>🏛 Govt Subsidy</Text>
        <Text style={styles.headerSub}>Manage farmer subsidy schemes</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 60 }}>
            No subsidy added
          </Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={{ color: "#fff", fontSize: 30 }}>＋</Text>
      </TouchableOpacity>

      {/* FORM MODAL */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modal}>

          <ScrollView>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit Subsidy" : "Create Subsidy"}
            </Text>

            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input}/>
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline style={styles.textArea}/>
            <TextInput placeholder="Scheme Type" value={schemeType} onChangeText={setSchemeType} style={styles.input}/>

            <TouchableOpacity style={styles.input} onPress={() => setStateModal(true)}>
              <Text>{stateName || "Select State"}</Text>
            </TouchableOpacity>

            <TextInput placeholder="Last Date" value={lastDate} onChangeText={setLastDate} style={styles.input}/>
            <TextInput placeholder="Apply Link" value={link} onChangeText={setLink} style={styles.input}/>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image
                ? <Image source={{ uri: image }} style={{ width:"100%", height:"100%", borderRadius:12 }}/>
                : <Text>Select Image</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.publish} onPress={savePost}>
              <Text style={{ color:"#fff", fontWeight:"700" }}>SAVE</Text>
            </TouchableOpacity>

          </ScrollView>

        </SafeAreaView>
      </Modal>

      {/* STATE LIST */}
      <Modal visible={stateModal} animationType="slide">
        <SafeAreaView style={{ flex:1, backgroundColor:"#fff" }}>

          <Text style={styles.stateTitle}>Select State</Text>

          <FlatList
            data={STATES}
            keyExtractor={(i) => i}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stateItem}
                onPress={() => {
                  setStateName(item);
                  setStateModal(false);
                }}
              >
                <Text style={{ fontSize:16 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />

        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F4F6FA" },

  header:{
    backgroundColor:"#FF7A00",
    paddingTop:55,
    paddingBottom:28,
    paddingHorizontal:18,
    borderBottomLeftRadius:28,
    borderBottomRightRadius:28,
  },

  headerTitle:{ fontSize:24, fontWeight:"800", color:"#fff" },
  headerSub:{ color:"#FFE7D1", marginTop:4 },

  card:{
    backgroundColor:"#fff",
    borderRadius:18,
    marginBottom:16,
    elevation:4,
    borderWidth:1,
    borderColor:"#e0e0e0",
    overflow:"hidden"
  },

  image:{ width:"100%", height:width*0.55 },

  title:{ fontSize:16, fontWeight:"700" },
  desc:{ fontSize:13, color:"#555", marginTop:3 },
  meta:{ fontSize:12, color:"#444", marginTop:4 },
  link:{ fontSize:14, color:"#1976D2", marginTop:8, fontWeight:"700" },

  actionRow:{ flexDirection:"row", justifyContent:"flex-end", padding:10 },

  editBtn:{ backgroundColor:"#2196F3", paddingHorizontal:12, paddingVertical:5, borderRadius:20, marginRight:8 },
  deleteBtn:{ backgroundColor:"#E53935", paddingHorizontal:12, paddingVertical:5, borderRadius:20 },

  actionText:{ color:"#fff", fontSize:12 },

  fab:{
    position:"absolute",
    bottom:30,
    right:24,
    width:65,
    height:65,
    borderRadius:32,
    backgroundColor:"#FF7A00",
    justifyContent:"center",
    alignItems:"center",
  },

  modal:{ flex:1, padding:20 },

  modalTitle:{ fontSize:22, fontWeight:"800", marginBottom:15 },

  input:{ backgroundColor:"#F1F3F7", padding:14, borderRadius:12, marginBottom:10 },

  textArea:{
    backgroundColor:"#F1F3F7",
    padding:14,
    borderRadius:12,
    height:120,
    marginBottom:10,
    textAlignVertical:"top"
  },

  imagePicker:{
    height:160,
    backgroundColor:"#F1F3F7",
    borderRadius:12,
    justifyContent:"center",
    alignItems:"center",
    marginTop:5
  },

  publish:{
    backgroundColor:"#FF7A00",
    padding:16,
    borderRadius:14,
    alignItems:"center",
    marginTop:20
  },

  stateTitle:{
    fontSize:22,
    fontWeight:"800",
    padding:20
  },

  stateItem:{
    padding:18,
    borderBottomWidth:1,
    borderColor:"#eee"
  }
});