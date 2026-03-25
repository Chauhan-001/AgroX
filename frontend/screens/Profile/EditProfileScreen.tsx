import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

export default function EditProfileScreen() {

  const navigation = useNavigation();
  const route = useRoute();

  const oldUser = route.params?.user;

  const [user, setUser] = useState(oldUser);

  const changePhoto = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setUser({ ...user, avatar: res.assets[0].uri });
      }
    });
  };

  const saveProfile = () => {
    Alert.alert("Profile Updated ✅");
    navigation.replace("Profile", { user });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ⭐ HEADER */}
        <Text style={styles.title}>Edit Profile</Text>

        {/* ⭐ IMAGE */}
        <TouchableOpacity onPress={changePhoto}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.change}>Change Photo</Text>
        </TouchableOpacity>

        {/* ⭐ INPUTS */}
        <TextInput
          value={user.name}
          onChangeText={(t) => setUser({ ...user, name: t })}
          placeholder="Name"
          style={styles.input}
        />

        <TextInput
          value={user.bio}
          onChangeText={(t) => setUser({ ...user, bio: t })}
          placeholder="Bio"
          style={styles.input}
        />

        <TextInput
          value={user.location}
          onChangeText={(t) => setUser({ ...user, location: t })}
          placeholder="Location"
          style={styles.input}
        />

        <TextInput
          value={user.phone}
          onChangeText={(t) => setUser({ ...user, phone: t })}
          placeholder="Phone"
          keyboardType="number-pad"
          style={styles.input}
        />

        {/* ⭐ SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  container: {
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FF7A00",
  },

  change: {
    textAlign: "center",
    color: "#FF7A00",
    marginTop: 6,
    marginBottom: 20,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    elevation: 2,
  },

  saveBtn: {
    marginTop: 10,
    backgroundColor: "#FF7A00",
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});