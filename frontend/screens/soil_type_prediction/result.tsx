import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SoilResult = ({ route, navigation }) => {
  // ✅ Get result passed from previous screen
const result =
  typeof route?.params?.result === "string"
    ? route.params.result
    : route?.params?.result?.result || "No Result";
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
        <View style={styles.container}>

          {/* RESULT CARD */}
          <View style={styles.resultCard}>
            <Text style={styles.headerText}>Soil Analysis Result</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Predicted Soil Type</Text>

              
               <Text style={{ color: 'white', fontSize: 30 }}>
                🌱 : {result}
                   </Text>
            <Text style={styles.infoText}>
              This prediction is based on your soil nutrients, moisture,
              and environmental conditions. Use this insight to improve crop yield.
            </Text>

            {/* BACK BUTTON */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#00c853', '#00e676']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>⬅ Test Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* HOME BUTTON */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.homeBtn}>Go to Dashboard</Text>
            </TouchableOpacity>

          </View>

          <Text style={styles.footer}>AgroX AI © 2026</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SoilResult;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#ff9100',
  },

  headerWrapper: {
    backgroundColor: '#ff9100',
    paddingTop: Platform.OS === 'android' ? 5 : 0,
  },

  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  headerLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  headerText: {
    fontSize: 18,
    color: '#aaa',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  divider: {
    height: 2,
    width: 60,
    backgroundColor: '#ff9100',
    marginVertical: 20,
  },

  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },

 resultText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#00e676',
  marginBottom: 20,
  textAlign: 'center',
  textShadowColor: '#00e676',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
},

  infoText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 25,
    lineHeight: 20,
  },

  buttonWrapper: {
    width: '100%',
    marginBottom: 15,
  },

  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },

  homeBtn: {
    color: '#ff9100',
    fontWeight: '600',
    marginTop: 10,
  },

  footer: {
    marginTop: 25,
    fontSize: 11,
    color: '#555',
  },
});