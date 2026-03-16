import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLogin({ navigation }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!adminId || !password) {
      Alert.alert("Error", "Enter Login ID & Password");
      return;
    }

    try {
         const response = await fetch("http://192.168.25.229:7000/api/admin/auth/login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ id: adminId, password }),
         });
   
   
         if (!response.ok) {
           Alert.alert("Invalid Credentials");
           return;
         }

          const data = await response.json();
          await AsyncStorage.setItem("token", data.token);
   
          navigation.replace("AdminHome");
   
       } catch (error) {
         Alert.alert("Verification failed");
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
          marginBottom: 8,
          color: "#111",
        }}
      >
        Admin Login
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 30,
        }}
      >
        Enter admin credentials
      </Text>

      {/* ADMIN ID */}
      <TextInput
        placeholder="Login ID"
        placeholderTextColor="#999"
        value={adminId}
        onChangeText={setAdminId}
        style={{
          backgroundColor: "#fff",
          color: "#000",   // ⭐ only change: typing text black
          height: 52,
          borderRadius: 10,
          paddingHorizontal: 14,
          marginBottom: 16,
          fontSize: 16,
        }}
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "#fff",
          color: "#000",   // ⭐ only change: typing text black
          height: 52,
          borderRadius: 10,
          paddingHorizontal: 14,
          marginBottom: 22,
          fontSize: 16,
        }}
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          height: 52,
          borderRadius: 10,
          backgroundColor: "#FF7A00",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}