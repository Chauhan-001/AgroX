import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  onPress: () => void;
}

export default function FloatingUploadButton({ onPress }: Props) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.mainFab}
        onPress={onPress}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 95,
  },

  mainFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF7A00",
    justifyContent: "center",
    alignItems: "center",

    elevation: 10, // android shadow
    shadowColor: "#000", // ios shadow
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  plus: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    marginTop: -2,
  },
});