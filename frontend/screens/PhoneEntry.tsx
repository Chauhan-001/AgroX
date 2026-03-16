import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";

export default function PhoneScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const sendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert("Enter valid phone number");
      return;
    }

    try {
      await fetch("http://192.168.25.229:7000/api/farmer/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
        
      });

      navigation.navigate("OTP", { phone });

    } catch (e) {
      Alert.alert("Server Error", "Failed to send OTP");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F6FA",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >

      {/* 3 DOT MENU BUTTON */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={{
          position: "absolute",
          top: 55,
          right: 20,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 24 }}>⋮</Text>
      </TouchableOpacity>

      {/* MENU MODAL */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: 90,
              right: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              elevation: 8,
              width: 170,
              paddingVertical: 6,
            }}
          >

            {/* ADMIN LOGIN */}
            <TouchableOpacity
              style={{ padding: 14 }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AdminLogin");
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                Admin Login
              </Text>
            </TouchableOpacity>

            {/* FARMER LOGIN (STAY HERE) */}
            <TouchableOpacity
              style={{ padding: 14 }}
              onPress={() => {
                setMenuVisible(false);
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                Farmer Login
              </Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>

      {/* HEADING */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 6,
          color: "#111",
        }}
      >
        AgroX Login
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 24,
        }}
      >
        Please enter your phone number
      </Text>

      {/* PHONE INPUT */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 10,
          paddingHorizontal: 12,
          height: 52,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginRight: 8,
          }}
        >
          +91
        </Text>

        <TextInput
          placeholder="Phone number"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={(text) =>
            setPhone(text.replace(/[^0-9]/g, ""))
          }
          style={{
            flex: 1,
            fontSize: 16,
          }}
        />
      </View>

      {/* SEND OTP */}
      <TouchableOpacity
        onPress={sendOtp}
        disabled={phone.length !== 10}
        style={{
          height: 52,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: phone.length === 10 ? "#FF7A00" : "#ccc",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Send OTP
        </Text>
      </TouchableOpacity>

      {/* CONTINUE AS GUEST */}
      <TouchableOpacity
        onPress={() => navigation.navigate("FarmerHome")}
        style={{
          marginTop: 12,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: "#007BFF",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Continue as Guest
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "#666",
        }}
      >
        🔒 We will send you a one-time verification code
      </Text>

    </View>
  );
}