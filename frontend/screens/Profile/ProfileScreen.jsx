import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // ✅ NOW SAFE

  const [user, setUser] = useState(
    route?.params?.user || {
      name: "Farmer Name",
      location: "Uttar Pradesh",
      phone: "9876543210",
      avatar: "https://i.pravatar.cc/150",
      bio: "Organic farming 🌾 | Smart agriculture",
    }
  );

  const posts = route?.params?.posts || [];

  const changePhoto = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.assets?.length) {
        setUser({ ...user, avatar: res.assets[0].uri });
      }
    });
  };

  const renderPost = ({ item }) => (
    <Image source={{ uri: item.images?.[0] }} style={styles.post} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>

        {/* HEADER */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>AgroX</Text>
        </View>

        {/* SCROLL */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120 + insets.bottom,
          }}
        >
          <View style={styles.headerCard}>
            <TouchableOpacity onPress={changePhoto}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </TouchableOpacity>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.bio}>{user.bio}</Text>

            <View style={styles.row}>
              <Text style={styles.meta}>📍 {user.location}</Text>
              <Text style={styles.meta}>📞 {user.phone}</Text>
            </View>

            <View style={styles.postStat}>
              <Text style={styles.postNumber}>{posts.length}</Text>
              <Text style={styles.postLabel}>Posts</Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate("EditProfile", { user })}
            >
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Activity</Text>

            <View style={styles.card}><Text style={styles.cardText}>🌾 My Crops</Text></View>
            <View style={styles.card}><Text style={styles.cardText}>🧠 Saved Predictions</Text></View>
            <View style={styles.card}><Text style={styles.cardText}>📊 Farming History</Text></View>
            <View style={styles.card}><Text style={styles.cardText}>⚙️ Settings</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Posts</Text>

            {posts.length === 0 ? (
              <Text style={styles.empty}>No posts yet</Text>
            ) : (
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item, i) => i.toString()}
                numColumns={3}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.tab} onPress={() => navigation.replace("FarmerHome")}>
            <Text style={styles.icon}>👥</Text>
            <Text style={styles.label}>Social</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => navigation.replace("PredictionScreen")}>
            <Text style={styles.icon}>🧠</Text>
            <Text style={styles.label}>Prediction</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => navigation.replace("SubsidyScreen")}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.label}>Subsidy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => navigation.replace("MarketScreen")}>
            <Text style={styles.icon}>🛒</Text>
            <Text style={styles.label}>Market</Text>
          </TouchableOpacity>

          <View style={styles.tab}>
            <Text style={styles.iconActive}>👤</Text>
            <Text style={styles.labelActive}>Profile</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },
  screen: { flex: 1 },

  headerBar: {
    height: 70,
    backgroundColor: "#FF7A00",
    justifyContent: "flex-end",
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
  },

  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "900" },

  headerCard: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 4,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FF7A00",
  },

  name: { fontSize: 22, fontWeight: "800" },
  bio: { color: "#666", marginTop: 2 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 6,
  },

  meta: { color: "#777", fontSize: 12 },

  postStat: { alignItems: "center", marginTop: 8 },
  postNumber: { fontSize: 20, fontWeight: "800" },
  postLabel: { color: "#777", fontSize: 12 },

  editBtn: {
    marginTop: 10,
    backgroundColor: "#FF7A00",
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 20,
  },

  editText: { color: "#fff", fontWeight: "700" },

  section: { marginHorizontal: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },

  card: {
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    paddingLeft: 15,
    marginBottom: 10,
    elevation: 2,
  },

  cardText: { fontSize: 15, fontWeight: "600" },

  empty: { textAlign: "center", color: "#777", marginBottom: 20 },

  post: { width: "33.33%", height: 120 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    elevation: 20,
  },

  tab: { alignItems: "center" },
  icon: { fontSize: 22, color: "#777" },
  iconActive: { fontSize: 22, color: "#FF7A00" },
  label: { fontSize: 11, color: "#777" },
  labelActive: { fontSize: 11, color: "#FF7A00", fontWeight: "700" },
});