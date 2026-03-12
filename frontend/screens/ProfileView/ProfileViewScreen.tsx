import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";

const WIDTH = Dimensions.get("window").width;

export default function ProfileViewScreen({ user, posts = [], onBack }: any) {

  const [openPost, setOpenPost] = useState<any>(null);

  const userPosts = posts.filter(
    (p: any) => p.username === user?.username
  );

  return (
    <View style={styles.container}>

      {/* ⭐ TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.topName}>
          {user?.username || "farmer_user"}
        </Text>

        <Text style={styles.menu}>⋮</Text>
      </View>

      <ScrollView>

        {/* ⭐ PROFILE ROW */}
        <View style={styles.profileRow}>

          {/* ⭐ ORANGE RING */}
          <View style={styles.ring}>
            <Image
              source={{ uri: user?.userImage }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNum}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNum}>--</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNum}>--</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>

        </View>

        {/* ⭐ USER DETAILS */}
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={styles.name}>
            {user?.username}
          </Text>

          <Text style={styles.bio}>
            🌾 Smart Farmer {"\n"}
            🚜 Modern Agriculture {"\n"}
            📍 {user?.location}
          </Text>
        </View>

        {/* ⭐ BUTTON ROW */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.msgBtn}>
            <Text style={styles.msgText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* ⭐ POSTS GRID */}
        <FlatList
          data={userPosts}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setOpenPost(item)}>
              <Image source={{ uri: item.uri }} style={styles.grid} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ marginTop: 15 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No posts yet
            </Text>
          }
        />

      </ScrollView>

      {/* ⭐ POST VIEWER */}
      <Modal visible={openPost !== null} transparent animationType="fade">
        <View style={styles.viewerBg}>
          <View style={styles.viewerCard}>

            <View style={styles.viewerHeader}>
              <Image
                source={{ uri: openPost?.userImage }}
                style={styles.viewerAvatar}
              />
              <View>
                <Text style={styles.viewerName}>
                  {openPost?.username}
                </Text>
                <Text style={styles.viewerLocation}>
                  📍 {openPost?.location}
                </Text>
              </View>
            </View>

            <Image
              source={{ uri: openPost?.uri }}
              style={styles.viewerImage}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpenPost(null)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },

  back: { fontSize: 22 },
  topName: { fontWeight: "700", fontSize: 17 },
  menu: { fontSize: 22 },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  ring: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: "#FF7A00",
    marginRight: 15,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statNum: {
    fontWeight: "800",
    fontSize: 18,
  },

  statLabel: {
    fontSize: 12,
    color: "#777",
  },

  name: {
    fontWeight: "700",
    marginTop: 10,
  },

  bio: {
    marginTop: 4,
    color: "#444",
    lineHeight: 18,
  },

  btnRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 15,
  },

  followBtn: {
    flex: 1,
    backgroundColor: "#FF7A00",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  followText: {
    color: "#fff",
    fontWeight: "700",
  },

  msgBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  msgText: { fontWeight: "700" },

  grid: {
    width: WIDTH / 3,
    height: WIDTH / 3,
  },

  viewerBg: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },

  viewerCard: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },

  viewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  viewerName: { fontWeight: "700" },
  viewerLocation: { fontSize: 12, color: "#666" },

  viewerImage: {
    width: "100%",
    height: 320,
  },

  closeBtn: {
    backgroundColor: "#FF7A00",
    padding: 12,
    alignItems: "center",
  },

});