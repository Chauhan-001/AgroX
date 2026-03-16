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
  ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

/* ⭐ GLOBAL SESSION STORE */
let MARKET_SESSION = [];

export default function AdminMarketScreen() {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);

  const [crop, setCrop] = useState("");
  const [org, setOrg] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setPosts([...MARKET_SESSION]);
    }
  }, [isFocused]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res?.assets?.length > 0) {
        setImage(res.assets[0].uri);
      }
    });
  };

  const savePost = async () => {

    if (!crop.trim() || !org.trim() || !price.trim()) {
      Alert.alert("Error", "Fill required fields");
      return;
    }

  try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        return;
      }

      const formData = new FormData();
      formData.append("crop", crop);
      formData.append("organization", org);
      formData.append("quantity", qty);
      formData.append("price", price);
      formData.append("phone", phone);
      formData.append("description", desc);
      

      image.forEach((img, index) => {
        const filename = img.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("images", {
          uri: img,
          name: filename || `photo_${index}.jpg`,
          type,
        });
      });

      const response = await fetch(
        "http://192.168.29.97:7000/api/admin/news",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "added successfully");
        console.log(data);
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Network error");
    }
  };

        
  

    /* reset */
    setCrop("");
    setOrg("");
    setQty("");
    setPrice("");
    setPhone("");
    setEmail("");
    setDesc("");
    setImage(null);
    setEditingId(null);
    setModal(false);
  };

  const editPost = (item) => {
    setCrop(item.crop || "");
    setOrg(item.org || "");
    setQty(item.qty || "");
    setPrice(item.price || "");
    setPhone(item.phone || "");
    setEmail(item.email || "");
    setDesc(item.desc || "");
    setImage(item.image || null);
    setEditingId(item.id);
    setModal(true);
  };

  const deletePost = (id) => {
    Alert.alert("Delete Offer", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          MARKET_SESSION =
            MARKET_SESSION.filter((p) => p.id !== id);
          setPosts([...MARKET_SESSION]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      )}

      <View style={{ padding: 14 }}>
        <Text style={styles.crop}>{item.crop}</Text>
        <Text style={styles.org}>{item.org}</Text>

        <Text style={styles.price}>
          ₹ {item.price} / Quintal
        </Text>

        {item.qty ? (
          <Text style={styles.info}>
            Required Qty: {item.qty} Quintal
          </Text>
        ) : null}

        {item.phone ? (
          <Text style={styles.info}>📞 {item.phone}</Text>
        ) : null}

        {item.email ? (
          <Text style={styles.info}>✉ {item.email}</Text>
        ) : null}

        {item.desc ? (
          <Text style={styles.desc}>{item.desc}</Text>
        ) : null}

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
        <Text style={styles.headerTitle}>🌾 Market Demand</Text>
        <Text style={styles.headerSub}>
          Organization crop buying offers
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ textAlign:"center", marginTop:50 }}>
            No Offers Created
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModal(true)}
      >
        <Text style={{ color:"#fff", fontSize:30 }}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modal} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>

          <Text style={styles.modalTitle}>
            {editingId ? "Edit Offer" : "Create Offer"}
          </Text>

          <TextInput placeholder="Crop Name" value={crop} onChangeText={setCrop} style={styles.input}/>
          <TextInput placeholder="Organization Name" value={org} onChangeText={setOrg} style={styles.input}/>
          <TextInput placeholder="Required Qty (Quintal)" value={qty} onChangeText={setQty} keyboardType="numeric" style={styles.input}/>
          <TextInput placeholder="Offer Price ₹" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input}/>
          <TextInput placeholder="Contact Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input}/>
          <TextInput
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
            style={styles.textArea}
          />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image
              ? <Image source={{ uri:image }} style={{ width:"100%", height:"100%", borderRadius:12 }}/>
              : <Text>Select Crop Image</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.publishBtn} onPress={savePost}>
            <Text style={styles.publishText}>
              {editingId ? "Update Offer" : "Publish Offer"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setModal(false)}>
            <Text style={{ color:"#555" }}>Close</Text>
          </TouchableOpacity>

        </ScrollView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container:{ flex:1, backgroundColor:"#F4F6FA" },
header:{ backgroundColor:"#FF7A00", paddingTop:55, paddingBottom:25, paddingHorizontal:18, borderBottomLeftRadius:25, borderBottomRightRadius:25 },
headerTitle:{ fontSize:24, fontWeight:"800", color:"#fff" },
headerSub:{ color:"#FFE7D1", marginTop:4 },
card:{ backgroundColor:"#e1c4c4", borderRadius:18, marginBottom:16, elevation:4, overflow:"hidden" },
image:{ width:"100%", height:width*0.55 },
crop:{ fontSize:18, fontWeight:"800" },
org:{ fontSize:13, color:"#777" },
price:{ fontSize:16, color:"#2E7D32", fontWeight:"800", marginVertical:4 },
info:{ fontSize:13, color:"#555" },
desc:{ fontSize:13, color:"#666", marginTop:6 },
date:{ fontSize:11, color:"#999", marginTop:6 },
actionRow:{ flexDirection:"row", justifyContent:"flex-end", padding:10 },
editBtn:{ backgroundColor:"#2196F3", paddingHorizontal:12, paddingVertical:5, borderRadius:20, marginRight:8 },
deleteBtn:{ backgroundColor:"#E53935", paddingHorizontal:12, paddingVertical:5, borderRadius:20 },
actionText:{ color:"#fff", fontSize:12 },
fab:{ position:"absolute", bottom:30, right:24, width:65, height:65, borderRadius:32, backgroundColor:"#FF7A00", justifyContent:"center", alignItems:"center", elevation:8 },
modalContainer:{ padding:20, paddingTop:60, backgroundColor:"#fff" },
modalTitle:{ fontSize:22, fontWeight:"800", marginBottom:15 },
input:{ backgroundColor:"#fb9d32", padding:14, borderRadius:14, marginBottom:10 },
textArea:{ backgroundColor:"#fb9d32", padding:14, borderRadius:14, height:110, marginBottom:10, textAlignVertical:"top" },
imagePicker:{ height:150, backgroundColor:"#F1F3F7", borderRadius:14, justifyContent:"center", alignItems:"center" },
publishBtn:{ backgroundColor:"#FF7A00", padding:16, borderRadius:16, alignItems:"center", marginTop:20 },
publishText:{ color:"#fff", fontWeight:"700" },
closeBtn:{ alignItems:"center", marginTop:12 }
});