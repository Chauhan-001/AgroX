import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

export default function SocialScreen({ posts = [], onOpenProfile }: any) {
  const [liked, setLiked] = useState<any>({});
  const [likeCount, setLikeCount] = useState<any>({});
  const [comments, setComments] = useState<any>({});
  const [activePost, setActivePost] = useState<number | null>(null);
  const [text, setText] = useState("");

  const toggleLike = (id: number) => {
    setLiked((prev: any) => {
      const isLiked = prev[id];

      setLikeCount((c: any) => ({
        ...c,
        [id]: isLiked ? (c[id] || 1) - 1 : (c[id] || 0) + 1,
      }));

      return { ...prev, [id]: !isLiked };
    });
  };

  const addComment = () => {
    if (!text.trim() || activePost === null) return;

    setComments((prev: any) => ({
      ...prev,
      [activePost]: [...(prev[activePost] || []), text],
    }));

    setText("");
  };

  const renderItem = ({ item }: any) => {
    if (!item?.uri) return null;

    const likes = likeCount[item.id] || 0;
    const commentCount = (comments[item.id] || []).length;

    return (
      <View style={styles.card}>
        {/* ⭐ HEADER CLICKABLE */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => onOpenProfile && onOpenProfile(item)}
        >
          <Image
            source={{ uri: item.userImage || "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.username}>
              {item.username || "Farmer User"}
            </Text>
            <Text style={styles.location}>
              📍 {item.location || "Moradabad"}
            </Text>
          </View>

          <Text style={styles.more}>⋯</Text>
        </TouchableOpacity>

        {/* ⭐ IMAGE */}
        <Image source={{ uri: item.uri }} style={styles.image} />

        {/* ⭐ ACTION BAR */}
        <View style={styles.actionBar}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <Text style={styles.icon}>
                {liked[item.id] ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActivePost(item.id)}>
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ⭐ COUNTS */}
        <View style={styles.countSection}>
          <Text style={styles.likeText}>{likes} likes</Text>
          <Text style={styles.commentText}>{commentCount} comments</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15, paddingBottom: 150 }}
      />

      {/* ⭐ COMMENT MODAL */}
      <Modal visible={activePost !== null} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Comments</Text>

            <FlatList
              data={comments[activePost] || []}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <Text style={styles.commentItem}>💬 {item}</Text>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Write a comment..."
                value={text}
                onChangeText={setText}
                style={styles.input}
              />
              <TouchableOpacity style={styles.postBtn} onPress={addComment}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Post</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setActivePost(null)}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  username: {
    fontWeight: "700",
    fontSize: 15,
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  more: {
    fontSize: 20,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 270,
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  leftActions: {
    flexDirection: "row",
  },
  icon: {
    fontSize: 24,
    marginRight: 18,
  },
  countSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likeText: {
    fontWeight: "700",
    marginBottom: 2,
  },
  commentText: {
    color: "#666",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "#00000070",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    maxHeight: "70%",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  commentItem: {
    paddingVertical: 6,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  postBtn: {
    backgroundColor: "#FF7A00",
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
  },
  close: {
    textAlign: "center",
    marginTop: 10,
    color: "#888",
  },
});