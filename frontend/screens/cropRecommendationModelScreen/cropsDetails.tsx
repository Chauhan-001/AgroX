import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const BASE_URL = "http://192.168.25.68:7000";

const FarmingGuide = ({ route, navigation }) => {
  const { crop } = route.params; 

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCropDetails = async () => {
    try {
      const Token = await AsyncStorage.getItem('FarmerToken');
      const res = await fetch(`${BASE_URL}/api/farmer/crop-detail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crop }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");

      // Extracting details array
      const detailsArray = Object.values(data.details);
      setDetails(detailsArray);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropDetails();
  }, []);

  return (
    <View style={styles.outerContainer}>
      {/* STATUS BAR & BRANDED HEADER */}
      <StatusBar barStyle="light-content" backgroundColor="#ff9100" translucent={false} />
      
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerLogo}>AGROX</Text>
          </View>
        </SafeAreaView>
      </View>

      <LinearGradient colors={['#1b2735', '#090a0f']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.glassCard}>
            <View style={styles.titleSection}>
              <Text style={styles.emojiText}>🌱</Text>
              <Text style={styles.title}>{crop.toUpperCase()}</Text>
              <Text style={styles.subtitle}>Professional Farming Guide</Text>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#00e676" />
                <Text style={styles.loadingText}>Fetching cultivation steps...</Text>
              </View>
            ) : Array.isArray(details) && details.length > 0 ? (

              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.tableInternal}>
                    {/* TABLE HEADER */}
                    <View style={styles.tableHeader}>
                      <Text style={[styles.headerCell, {width: 100}]}>Stage</Text>
                      <Text style={[styles.headerCell, {width: 80}]}>Time</Text>
                      <Text style={[styles.headerCell, {width: 130}]}>Activity</Text>
                      <Text style={[styles.headerCell, {width: 120}]}>Fertilizer</Text>
                      <Text style={[styles.headerCell, {width: 80}]}>NPK</Text>
                      <Text style={[styles.headerCell, {width: 200}]}>Expert Notes</Text>
                    </View>

                    {/* TABLE BODY */}
                    {details.map((item, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.tableRow, 
                          index === details.length - 1 ? { borderBottomWidth: 0 } : {}
                        ]}
                      >
                        <Text style={[styles.cell, styles.stageText, {width: 100}]}>{item.stage}</Text>
                        <Text style={[styles.cell, {width: 80, color: '#ff9100'}]}>{item.time}</Text>
                        <Text style={[styles.cell, {width: 130}]}>{item.activity}</Text>
                        <Text style={[styles.cell, {width: 120, color: '#00e676'}]}>{item.fertilizer}</Text>
                        <Text style={[styles.cell, {width: 80}]}>{item.npk}</Text>
                        <Text style={[styles.cell, styles.notesText, {width: 200}]}>{item.notes}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.noData}>⚠ No cultivation data available for this variety yet.</Text>
              </View>
            )}

            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => navigation.goBack()}
              style={styles.backBtnWrapper}
            >
              <LinearGradient
                colors={['#00c853', '#00e676']}
                style={styles.backBtn}
              >
                <Text style={styles.buttonText}>⬅ Return to Crops</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>AgroX Intelligence System © 2026</Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#ff9100' },
  background: { flex: 1 },
  
  // Header Styles
  headerWrapper: {
    backgroundColor: '#ff9100',
    elevation: 8,
    zIndex: 10,
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

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  titleSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  emojiText: { fontSize: 40, marginBottom: 5 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#00e676',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  loaderContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 15,
    fontSize: 14,
  },

  tableContainer: {
    backgroundColor: '#111',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  tableInternal: {
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderBottomWidth: 2,
    borderBottomColor: '#00c853',
  },
  headerCell: {
    padding: 15,
    color: '#00c853',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    alignItems: 'center',
  },
  cell: {
    padding: 15,
    color: '#eee',
    fontSize: 13,
    lineHeight: 18,
  },
  stageText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  notesText: {
    fontSize: 12,
    color: '#bbb',
    fontStyle: 'italic',
  },

  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noData: {
    color: '#ff5252',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },

  backBtnWrapper: {
    marginTop: 30,
    shadowColor: '#00c853',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  backBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  footer: {
    marginTop: 25,
    textAlign: 'center',
    color: '#555',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FarmingGuide;