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
  StatusBar,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

let MARKET_SESSION = [];

const token = "YOUR_TOKEN_HERE";

export default function AdminMarketScreen() {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setPosts([...MARKET_SESSION]);
    }
  }, [isFocused]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.7 }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        setImage(res.assets[0].uri);
      }
    });
  };

  const savePost = async () => {

    if (loading) return;

    if (!title.trim() || !product.trim() || !price.trim()) {
      Alert.alert("Error", "Fill required fields");
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("product", product);
      formData.append("company", company);
      formData.append("price", price);
      formData.append("contactInfo", contactInfo);
      formData.append("description", description);

      if (image) {
        formData.append("image", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }

      const response = await fetch(
        "http://192.168.29.97:7000/api/admin/market",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Server error");
      }

      /* ⭐⭐⭐ IMPORTANT FIX ⭐⭐⭐ */
      const newPost = {
        id: Date.now().toString(),
        title: title,
        product: product,
        company: company,
        price: price,
        contactInfo: contactInfo,
        description: description,
        image: image,
        date: new Date().toLocaleDateString(),
      };

      if (editingId) {
        MARKET_SESSION = MARKET_SESSION.map(p =>
          p.id === editingId ? newPost : p
        );
      } else {
        MARKET_SESSION = [newPost, ...MARKET_SESSION];
      }

      setPosts([...MARKET_SESSION]);   // ⭐ immediate UI refresh

      Alert.alert("Success", editingId ? "Updated" : "Added");

      setTitle("");
      setProduct("");
      setCompany("");
      setPrice("");
      setContactInfo("");
      setDescription("");
      setImage(null);
      setEditingId(null);
      setModal(false);

    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.message);
    }

    setLoading(false);
  };

  const editPost = (item) => {
    setTitle(item.title);
    setProduct(item.product);
    setCompany(item.company);
    setPrice(item.price);
    setContactInfo(item.contactInfo);
    setDescription(item.description);
    setImage(item.image);
    setEditingId(item.id);
    setModal(true);
  };

  const deletePost = (id) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          MARKET_SESSION = MARKET_SESSION.filter(p => p.id !== id);
          setPosts([...MARKET_SESSION]);
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
        <Text style={styles.product}>{item.product}</Text>

        {!!item.company && (
          <Text style={styles.company}>🏢 {item.company}</Text>
        )}

        <Text style={styles.price}>₹ {item.price}</Text>

        {!!item.contactInfo && (
          <Text style={styles.info}>📞 {item.contactInfo}</Text>
        )}

        {!!item.description && (
          <Text style={styles.desc}>{item.description}</Text>
        )}

        <Text style={styles.date}>{item.date}</Text>
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
        <Text style={styles.headerTitle}>🛒 Agri Market</Text>
        <Text style={styles.headerSub}>Manage product listings</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign:"center", marginTop:60 }}>
            No Products Added
          </Text>
        }
        contentContainerStyle={{ padding:16, paddingBottom:120 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
        <Text style={{ color:"#fff", fontSize:30 }}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modal} animationType="slide">
        <SafeAreaView style={{ flex:1 }}>
          <ScrollView contentContainerStyle={styles.modalContainer}>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit Product" : "Create Product"}
            </Text>

            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input}/>
            <TextInput placeholder="Product" value={product} onChangeText={setProduct} style={styles.input}/>
            <TextInput placeholder="Company" value={company} onChangeText={setCompany} style={styles.input}/>
            <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input}/>
            <TextInput placeholder="Contact Info" value={contactInfo} onChangeText={setContactInfo} style={styles.input}/>
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline style={styles.textArea}/>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image
                ? <Image source={{ uri:image }} style={{ width:"100%", height:"100%", borderRadius:12 }}/>
                : <Text>Select Image</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.publishBtn} onPress={savePost}>
              <Text style={styles.publishText}>
                {loading ? "Processing..." : "SAVE"}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F4F6FA" },
  header:{ backgroundColor:"#FF7A00", paddingTop:55, paddingBottom:25, paddingHorizontal:18, borderBottomLeftRadius:25, borderBottomRightRadius:25 },
  headerTitle:{ fontSize:24, fontWeight:"800", color:"#fff" },
  headerSub:{ color:"#FFE7D1", marginTop:4 },
  card:{ backgroundColor:"#fff", borderRadius:18, marginBottom:16, elevation:4, overflow:"hidden" },
  image:{ width:"100%", height:width*0.55 },
  title:{ fontSize:18, fontWeight:"800" },
  product:{ fontSize:14, color:"#777" },
  company:{ fontSize:13, color:"#555", marginTop:4 },
  price:{ fontSize:16, color:"#2E7D32", fontWeight:"800", marginTop:4 },
  info:{ fontSize:13, color:"#555", marginTop:4 },
  desc:{ fontSize:13, color:"#666", marginTop:6 },
  date:{ fontSize:11, color:"#999", marginTop:6 },
  actionRow:{ flexDirection:"row", justifyContent:"flex-end", padding:10 },
  editBtn:{ backgroundColor:"#2196F3", paddingHorizontal:12, paddingVertical:5, borderRadius:20, marginRight:8 },
  deleteBtn:{ backgroundColor:"#E53935", paddingHorizontal:12, paddingVertical:5, borderRadius:20 },
  actionText:{ color:"#fff", fontSize:12 },
  fab:{ position:"absolute", bottom:30, right:24, width:65, height:65, borderRadius:32, backgroundColor:"#FF7A00", justifyContent:"center", alignItems:"center", elevation:8 },
  modalContainer:{ padding:20, paddingTop:60, backgroundColor:"#fff" },
  modalTitle:{ fontSize:22, fontWeight:"800", marginBottom:15 },
  input:{ backgroundColor:"#F1F3F7", padding:14, borderRadius:14, marginBottom:10 },
  textArea:{ backgroundColor:"#F1F3F7", padding:14, borderRadius:14, height:110, marginBottom:10, textAlignVertical:"top" },
  imagePicker:{ height:150, backgroundColor:"#F1F3F7", borderRadius:14, justifyContent:"center", alignItems:"center" },
  publishBtn:{ backgroundColor:"#FF7A00", padding:16, borderRadius:16, alignItems:"center", marginTop:20 },
  publishText:{ color:"#fff", fontWeight:"700" }
});