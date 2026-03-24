import React, { useState, useCallback } from 'react';
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
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://192.168.25.68:7000";

/* ================= INPUT ================= */
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
        if (/^\d*\.?\d*$/.test(text)) {
          onChangeText(text);
        }
      }}
    />
  </View>
);

const SoilPrediction = ({ navigation }) => {
  const [formData, setFormData] = useState({
    ph: '',
    moisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    carbon: '',
    texture: '',
    temp: '',
    rainfall: '',
  });

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const textureOptions = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Peaty'];

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const selectTexture = (value) => {
    handleInputChange('texture', value);
    setShowDropdown(false);
  };

  /* ================= VALIDATION ================= */
  const validateValues = (values) => {
    const rules = {
      ph: [3.5, 9],
      moisture: [0, 100],
      nitrogen: [0, 140],
      phosphorus: [5, 145],
      potassium: [5, 205],
      carbon: [0, 5],
      temp: [0, 50],
      rainfall: [20, 3000],
    };

    for (let key in rules) {
      const [min, max] = rules[key];
      if (values[key] < min || values[key] > max) {
        Alert.alert(
          "Not Feasible ❌",
          `${key.toUpperCase()} must be between ${min} and ${max}`
        );
        return false;
      }
    }
    return true;
  };

  /* ================= PREDICT ================= */
  const handlePredict = async () => {
    // Check empty
    for (let key in formData) {
      if (!formData[key]) {
        Alert.alert("Required", "Please fill all fields including texture");
        return;
      }
    }

    const values = {
      ph: Number(formData.ph),
      moisture: Number(formData.moisture),
      nitrogen: Number(formData.nitrogen),
      phosphorus: Number(formData.phosphorus),
      potassium: Number(formData.potassium),
      carbon: Number(formData.carbon),
      texture: formData.texture,
      temp: Number(formData.temp),
      rainfall: Number(formData.rainfall),
    };

    if (!validateValues(values)) return;

    try {
      Keyboard.dismiss();
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/farmer/predict-soil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("FarmerToken")}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
console.log("API RESPONSE:", data);
     

      if (!data.success) {
        throw new Error(data.error || "Prediction failed");
      }


      navigation.navigate("resultSoil", {
        result: data.result,
      });

    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#ff9100" />

      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerLogo}>AGROX</Text>
          </View>
        </SafeAreaView>
      </View>

      <LinearGradient colors={['#1b2735', '#090a0f']} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.headerText}>🧪 Soil Prediction</Text>

              <InputField label="pH" value={formData.ph} onChangeText={(v)=>handleInputChange('ph',v)} placeholder="6.5" />
              <InputField label="Moisture (%)" value={formData.moisture} onChangeText={(v)=>handleInputChange('moisture',v)} placeholder="20" />
              <InputField label="Nitrogen (N)" value={formData.nitrogen} onChangeText={(v)=>handleInputChange('nitrogen',v)} placeholder="90" />
              <InputField label="Phosphorus (P)" value={formData.phosphorus} onChangeText={(v)=>handleInputChange('phosphorus',v)} placeholder="42" />
              <InputField label="Potassium (K)" value={formData.potassium} onChangeText={(v)=>handleInputChange('potassium',v)} placeholder="43" />
              <InputField label="Organic Carbon" value={formData.carbon} onChangeText={(v)=>handleInputChange('carbon',v)} placeholder="0.5" />

              {/* TEXTURE DROPDOWN */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Soil Texture</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text style={{ color: '#fff' }}>
                    {formData.texture || "Select Texture"}
                  </Text>
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdownMenu}>
                    {textureOptions.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.dropdownItem}
                        onPress={() => selectTexture(item)}
                      >
                        <Text style={{ color: '#fff' }}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <InputField label="Temperature (°C)" value={formData.temp} onChangeText={(v)=>handleInputChange('temp',v)} placeholder="28" />
              <InputField label="Rainfall (mm)" value={formData.rainfall} onChangeText={(v)=>handleInputChange('rainfall',v)} placeholder="150" />

              {/* BUTTON */}
              <TouchableOpacity onPress={handlePredict}>
                <LinearGradient colors={['#00c853','#ff9100']} style={styles.button}>
                  {loading
                    ? <ActivityIndicator color="#fff"/>
                    : <Text style={styles.buttonText}>Predict Soil 🔍</Text>}
                </LinearGradient>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SoilPrediction;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  headerWrapper: { backgroundColor: '#ff9100' },
  headerContent: { padding: 15 },
  headerLogo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  background: { flex: 1 },
  scrollContent: { padding: 20 },

  container: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
  },

  headerText: {
    color: "#00e676",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold"
  },

  inputGroup: { marginBottom: 15 },
  label: { color: "#ccc", marginBottom: 5 },

  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8
  },

  dropdownBtn: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8
  },

  dropdownMenu: {
    backgroundColor: "#333",
    marginTop: 5,
    borderRadius: 8
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444"
  },

  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});