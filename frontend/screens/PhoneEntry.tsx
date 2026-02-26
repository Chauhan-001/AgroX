import React, { useState, useRef } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const FAKE_OTP = "1234";

export default function PhoneEntry({ navigation }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [menuVisible, setMenuVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert("Enter valid phone number");
      return;
    }

  
    setStep("otp");

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleVerifyOtp = () => {
    if (otp !== FAKE_OTP) {
      Alert.alert("Invalid OTP");
      return;
    }

    navigation.replace("Home");
  };

  const handleAdmin = () => {
    setMenuVisible(false);
    Alert.alert("Admin Panel");
  };

  return (
    <LinearGradient colors={["#FF7A00", "#FFB347"]} style={styles.container}>
      {/* 3 dot */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>

      {menuVisible && (
        <TouchableOpacity style={styles.dropdown} onPress={handleAdmin}>
          <Text style={styles.dropdownText}>Admin</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>AgroX</Text>
      <Text style={styles.subtitle}>Sign in with phone</Text>

      {step === "phone" && (
        <>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#eee"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            maxLength={10}
          />

          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === "otp" && (
        <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#eee"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            maxLength={6}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  menuButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  menuText: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  dropdownText: {
    fontWeight: "600",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    color: "#fff",
    marginBottom: 30,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FF7A00",
    fontWeight: "bold",
  },
});