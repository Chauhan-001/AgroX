import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OTPScreen({ route, navigation }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    if (otp.length < 4) return;

    try {
      const response = await fetch("http://192.168.25.68:7000/api/farmer/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Invalid OTP");
        return;
 

      }
      console.log("Received token:", data.token); 
      await AsyncStorage.setItem("FarmerToken", data.token);


      navigation.replace("FarmerHome");

    } catch (error) {
      Alert.alert("Verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await fetch("http://192.168.25.68:7000/api/farmer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      Alert.alert("OTP Resent");

    } catch (error) {
      Alert.alert("Failed to resend OTP");
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

      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 6,
          color: "#111",
        }}
      >
        Verify OTP
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 24,
        }}
      >
        Enter OTP sent to +91 {phone}
      </Text>

      {/* OTP Input */}
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          height: 52,
          paddingHorizontal: 16,
          fontSize: 18,
          marginBottom: 20,
          textAlign: "center",
          letterSpacing: 8,
        }}
      />

      {/* Verify Button */}
      <TouchableOpacity
        onPress={verifyOtp}
        disabled={otp.length < 4}
        style={{
          height: 52,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: otp.length >= 4 ? "#FF7A00" : "#ccc",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Verify OTP
        </Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      <TouchableOpacity
        onPress={resendOtp}
        style={{
          marginTop: 14,
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
          Resend OTP
        </Text>
      </TouchableOpacity>

    </View>
  );
}

