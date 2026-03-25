import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Keyboard
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {url} from "../../ipconfig"

const BASE_URL = `http://${url}:7000`;

/* ================= INPUT COMPONENT ================= */
const InputField = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#a38b3d"
      keyboardType="numeric"
      value={value}
      onChangeText={(text) => {
        // ✅ Allow only numbers + decimal
        if (/^\d*\.?\d*$/.test(text)) {
          onChangeText(text);
        }
      }}
    />
  </View>
);

const CropRecommendation = ({ navigation }) => {
  const [formData, setFormData] = useState({
    N: "", P: "", K: "",
    temperature: "", humidity: "",
    ph: "", rainfall: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* ================= PREDICT ================= */
  const handlePredict = async () => {

    // ✅ EMPTY CHECK
    for (let key in formData) {
      if (!formData[key]) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
    }

    // ✅ CONVERT VALUES
    const values = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    // ✅ REAL WORLD VALIDATION
    const rules = {
      N: [0, 140],
      P: [5, 145],
      K: [5, 205],
      temperature: [0, 50],
      humidity: [10, 100],
      ph: [3.5, 9],
      rainfall: [20, 3000],
    };

    for (let key in values) {
      const [min, max] = rules[key];
      if (values[key] < min || values[key] > max) {
        Alert.alert(
          "Not Feasible ❌",
          `${key.toUpperCase()} should be between ${min} and ${max}`
        );
        return;
      }
    }

    try {
      Keyboard.dismiss(); // ✅ close keyboard
      setLoading(true);

      const token = await AsyncStorage.getItem("FarmerToken");

      const response = await fetch(`${BASE_URL}/api/farmer/predict-crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      console.log("Prediction:", data); // ✅ debug

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction failed");
      }

      // ✅ NAVIGATE TO NEXT SCREEN
      navigation.navigate("selectCrop", {
        result: data
      });

    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#ff9100" />

      {/* HEADER */}
      <View style={styles.headerBanner}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "http://googleusercontent.com/image_collection/image_retrieval/17708071289542746931_0" }}
            style={styles.logoIcon}
          />
          <Text style={styles.headerLogo}>AGROX</Text>
        </View>
      </View>

      <LinearGradient colors={["#1b2735", "#090a0f"]} style={styles.background}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <Text style={styles.headerText}>🌱 Crop Recommendation</Text>

                <InputField label="Nitrogen (N)" value={formData.N} onChangeText={(v) => handleInputChange("N", v)} placeholder="e.g. 90" />
                <InputField label="Phosphorous (P)" value={formData.P} onChangeText={(v) => handleInputChange("P", v)} placeholder="e.g. 42" />
                <InputField label="Potassium (K)" value={formData.K} onChangeText={(v) => handleInputChange("K", v)} placeholder="e.g. 43" />
                <InputField label="Temperature (°C)" value={formData.temperature} onChangeText={(v) => handleInputChange("temperature", v)} placeholder="e.g. 25.5" />
                <InputField label="Humidity (%)" value={formData.humidity} onChangeText={(v) => handleInputChange("humidity", v)} placeholder="e.g. 80" />
                <InputField label="Soil pH" value={formData.ph} onChangeText={(v) => handleInputChange("ph", v)} placeholder="e.g. 6.5" />
                <InputField label="Rainfall (mm)" value={formData.rainfall} onChangeText={(v) => handleInputChange("rainfall", v)} placeholder="e.g. 200" />

                {/* BUTTON */}
                <TouchableOpacity onPress={handlePredict} disabled={loading}>
                  <LinearGradient colors={["#00c853", "#ff9100"]} style={styles.button}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Predict Crop 🌾</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  outerContainer: { flex: 1 },

  headerBanner: {
    backgroundColor: '#ff9100',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    tintColor: '#fff',
  },

  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  background: { flex: 1 },

  scrollContent: {
    padding: 20,
  },

  container: {
    backgroundColor: "rgba(20,20,20,0.9)",
    borderRadius: 16,
    padding: 25,
  },

  headerText: {
    fontSize: 22,
    color: "#00e676",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },

  inputGroup: { marginBottom: 15 },

  label: { color: "#ccc", marginBottom: 5 },

  input: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    color: "white",
  },

  button: {
    marginTop: 15,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CropRecommendation;