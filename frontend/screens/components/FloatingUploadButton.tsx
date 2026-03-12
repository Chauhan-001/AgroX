import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";

import {
  launchImageLibrary,
  launchCamera,
} from "react-native-image-picker";

export default function FloatingUploadButton({ onPostCreate }: any) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const perm =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(perm);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        return false;
      }
    }
    return true;
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const toggle = () => {
    Animated.spring(anim, {
      toValue: open ? 0 : 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setOpen(!open);
  };

  const closeMenu = () => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setOpen(false);
  };

  /* ⭐ IMAGE PICK */
  const pickImage = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) return Alert.alert("Permission Denied");

    Alert.alert("Select Image Source", "", [
      {
        text: "Camera",
        onPress: async () => {
          const cam = await requestCameraPermission();
          if (!cam) return;

          closeMenu();

          launchCamera({ mediaType: "photo", quality: 0.8 }, (res) => {
            const uri = res.assets?.[0]?.uri;
            if (uri && onPostCreate) {
              onPostCreate({
                id: Date.now(),
                type: "image",
                uri: uri,
              });
            }
          });
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          closeMenu();

          launchImageLibrary({ mediaType: "photo" }, (res) => {
            const uri = res.assets?.[0]?.uri;
            if (uri && onPostCreate) {
              onPostCreate({
                id: Date.now(),
                type: "image",
                uri: uri,
              });
            }
          });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  /* ⭐ VIDEO PICK */
  const pickVideo = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) return Alert.alert("Permission Denied");

    Alert.alert("Select Video Source", "", [
      {
        text: "Camera",
        onPress: async () => {
          const cam = await requestCameraPermission();
          if (!cam) return;

          closeMenu();

          launchCamera({ mediaType: "video" }, (res) => {
            const uri = res.assets?.[0]?.uri;
            if (uri && onPostCreate) {
              onPostCreate({
                id: Date.now(),
                type: "video",
                uri: uri,
              });
            }
          });
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          closeMenu();

          launchImageLibrary({ mediaType: "video" }, (res) => {
            const uri = res.assets?.[0]?.uri;
            if (uri && onPostCreate) {
              onPostCreate({
                id: Date.now(),
                type: "video",
                uri: uri,
              });
            }
          });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const imgY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -70],
  });

  const videoY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -130],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[styles.subFab, { opacity, transform: [{ translateY: videoY }] }]}
      >
        <TouchableOpacity style={styles.smallFab} onPress={pickVideo}>
          <Text style={styles.icon}>🎥</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[styles.subFab, { opacity, transform: [{ translateY: imgY }] }]}
      >
        <TouchableOpacity style={styles.smallFab} onPress={pickImage}>
          <Text style={styles.icon}>🖼️</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.mainFab} onPress={toggle}>
        <Animated.Text style={[styles.plus, { transform: [{ rotate }] }]}>
          +
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 20, bottom: 95, alignItems: "center" },
  mainFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF7A00",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  plus: { color: "#fff", fontSize: 34, fontWeight: "900" },
  subFab: { position: "absolute", bottom: 8 },
  smallFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  icon: { fontSize: 22 },
});