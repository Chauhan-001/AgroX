import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Animated,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

const BASE_URL = "http://192.168.25.228:7000";
const API_URL = `${BASE_URL}/api/farmer`;

export default function SocialScreen() {
  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [commentModal, setCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("FarmerToken");

      const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const formatted = data.map((p) => ({
        ...p,
        images: p.mediaUrl?.map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}/${img}`
        ),
      }));

      setFeed(formatted);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  /* ================= LIKE POST ================= */
  const toggleLikePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("FarmerToken");

      await fetch(`${API_URL}/${postId}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPosts(); // refresh from backend
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= OPEN COMMENTS ================= */
  const openComments = (post) => {
    setActivePostId(post._id);
    setComments(post.comments || []);
    setCommentModal(true);
  };

  /* ================= ADD COMMENT ================= */
  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = await AsyncStorage.getItem("FarmerToken");

      const res = await fetch(`${API_URL}/${activePostId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await res.json();

      setComments([...comments, data]); // backend must return populated user
      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LIKE COMMENT ================= */
  const likeComment = async (commentId) => {
    const token = await AsyncStorage.getItem("FarmerToken");

    await fetch(
      `${API_URL}/${activePostId}/comment/${commentId}/like`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchPosts();
  };

  /* ================= REPLY ================= */
  const replyComment = async () => {
    if (!replyText.trim()) return;

    const token = await AsyncStorage.getItem("FarmerToken");

    await fetch(
      `${API_URL}/${activePostId}/comment/${replyTo._id}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText }),
      }
    );

    setReplyText("");
    setReplyTo(null);
    fetchPosts();
  };

  /* ================= IMAGE FIX ================= */
  const ImageCarousel = ({ images }) => {
    return (
      <View style={{ width: "100%", height: IMAGE_HEIGHT }}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{
                width: width - 50,
                height: IMAGE_HEIGHT,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          )}
        />
      </View>
    );
  };

  /* ================= POST ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>
        {item.postedBy?.name || "User"}
      </Text>

      {item.images?.length > 0 && (
        <ImageCarousel images={item.images} />
      )}

      <View style={styles.row}>
        <TouchableOpacity onPress={() => toggleLikePost(item._id)}>
          <Text>❤️ {item.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openComments(item)}>
          <Text>💬 {item.comments?.length || 0}</Text>
        </TouchableOpacity>
      </View>

      <Text>{item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />

      <FlatList
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* ================= COMMENTS MODAL ================= */}
      <Modal visible={commentModal}>
        <SafeAreaView style={{ flex: 1 }}>

          {/* HEADER WITH CLOSE BUTTON */}
          <View style={styles.modalHeader}>
            <Text style={{ fontSize: 18 }}>Comments</Text>

            <TouchableOpacity
              onPress={() => setCommentModal(false)}
              style={styles.closeBtn}
            >
              <Text style={{ color: "#fff" }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* COMMENTS LIST */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.bold}>
                  {item.user?.name || item.postedBy?.name || "User"}
                </Text>

                <Text>{item.text}</Text>

                <View style={styles.row}>
                  <TouchableOpacity onPress={() => likeComment(item._id)}>
                    <Text>❤️ {item.likes?.length || 0}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setReplyTo(item)}>
                    <Text>Reply</Text>
                  </TouchableOpacity>
                </View>

                {/* REPLIES */}
                {item.replies?.map((r) => (
                  <View key={r._id} style={{ marginLeft: 20 }}>
                    <Text style={styles.bold}>
                      {r.user?.name || "User"}
                    </Text>
                    <Text>{r.text}</Text>
                  </View>
                ))}
              </View>
            )}
          />

          {/* INPUT */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={
                replyTo ? "Reply..." : "Add comment..."
              }
              value={replyTo ? replyText : commentText}
              onChangeText={replyTo ? setReplyText : setCommentText}
            />

            <TouchableOpacity
              onPress={replyTo ? replyComment : addComment}
            >
              <Text style={{ color: "blue" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  card: {
    margin: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
  },
});